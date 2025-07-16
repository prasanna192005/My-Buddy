import os
import json
import logging
from dotenv import load_dotenv
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import status
import jwt
from datetime import datetime, timedelta
import PyPDF2
import google.generativeai as genai
from langchain.schema import AIMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from authentication.models import User
from .models import ChatMessage
from .serializers import ChatMessageSerializer
import logging
import tensorflow as tf
# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.ERROR)

# Load environment variables
load_dotenv()

# Configure Google Generative AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@csrf_exempt
def upload_pdfs(request):
    print("hi")
    logger.info("upload_pdfs view called")
    if request.method == 'POST':
        print("hello")
        logger.info("Received POST request.")
        if 'pdf_files' in request.FILES:
            print("enters")
            pdf_files = request.FILES.getlist('pdf_files')
            print(pdf_files)
            logger.info(f"Number of files received: {len(pdf_files)}")
            if not pdf_files:
                logger.error("No files found in the request.")
                return JsonResponse({'error': 'No files uploaded.'}, status=400)

            try:
                pdf_text = get_pdf_text(pdf_files)
                print(pdf_text)
                logger.info(f"Extracted text length: {len(pdf_text)}")
                text_chunks = get_text_chunks(pdf_text)
                get_vector_store(text_chunks)
                return JsonResponse({'status': 'PDF files processed successfully.'}, status=200)
            except Exception as e:
                logger.error(f"Error processing PDF files: {e}")
                return JsonResponse({'error': 'Error processing PDF files.'}, status=500)
        else:
            logger.error("No 'pdf_files' key found in request.FILES.")
            return JsonResponse({'error': 'No files uploaded.'}, status=400)
    else:
        logger.error("Invalid request method.")
        return JsonResponse({'error': 'Invalid request method.'}, status=400)

@csrf_exempt
def ask_question(request):
    logger.info("ask_question view called")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            question = data.get('question')
            logger.info(f"Question received: {question}")
            if not question:
                return JsonResponse({'error': 'No question provided.'}, status=400)
            
            response = user_input(question)
            logger.info(f"Response generated: {response}")
            return JsonResponse({'response': response}, status=200)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.error(f"Error processing question: {e}")
            return JsonResponse({'error': 'Error processing question.'}, status=500)
    else:
        logger.error("Invalid request method.")
        return JsonResponse({'error': 'Invalid request method.'}, status=400)

def get_pdf_text(pdf_files):
    raw_text = ""
    for pdf in pdf_files:
        print("vinayak")
        print(pdf)
        try:
            pdf_reader = PyPDF2.PdfReader(pdf)
            if not pdf_reader.pages:
                logger.error(f"No pages found in PDF file: {pdf.name}")
                continue
            print("again?")
            print(pdf_reader.pages)
            for page_num in range(len(pdf_reader.pages)):
                try:
                    page = pdf_reader.pages[page_num]
                    print("whatsupp bro")
                    
                    text = page.extract_text()
                    print("lets see")
                    print(text)
                    if not text:
                        logger.warning(f"No text found on page {page_num} of PDF file: {pdf.name}")
                        continue
                    raw_text += text
                    
                except Exception as e:
                    logger.error(f"Error extracting text from page {page_num} of PDF file: {pdf.name}. Error: {e}")
        
        except Exception as e:
            logger.error(f"Error processing PDF file: {pdf.name}. Error: {e}")
    
    if not raw_text:
        logger.error("No text extracted from the provided PDF files.")
    
    return raw_text


def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=50000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response.get("output_text", "No response generated.")

def get_user_from_token(request):
    try:
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return None, {"error": "Authorization header missing"}, status.HTTP_401_UNAUTHORIZED

        token = authorization_header.split(' ')[1]
        decoded_token = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])

        user_id = decoded_token.get('id')
        if not user_id:
            return None, {"error": "Invalid token format"}, status.HTTP_403_FORBIDDEN

        user = get_object_or_404(User, id=user_id)
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, {"error": "Token has expired"}, status.HTTP_403_FORBIDDEN
    except jwt.DecodeError:
        return None, {"error": "Invalid token"}, status.HTTP_403_FORBIDDEN
    except Exception as e:
        return None, {"error": str(e)}, status.HTTP_403_FORBIDDEN

@api_view(['POST'])
def chat(request):
    print("hi")
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return JsonResponse(error_response, status=status_code)

    question = request.data.get('question')
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

    # Get recent chat messages within the last 1 hour
    one_hour_ago = datetime.now() - timedelta(hours=1)
    recent_messages = ChatMessage.objects.filter(user=user, timestamp__gte=one_hour_ago).order_by('-timestamp')[:10]

    # Prepare the prompt with recent messages
    recent_chats = "\n".join([f"User: {msg.question}\nBot: {msg.response}" for msg in recent_messages])
    prompt = f"Generate an accurate response considering the question.\n\nRecent Chats:\n{recent_chats}\n\nQuestion: {question}"

    messages = [{"role": "user", "content": prompt}]

    try:
        response = model.invoke(messages)

        response_text = response.content if isinstance(response, AIMessage) else str(response)

        # Save the chat message to the database
        chat_message = ChatMessage(user=user, question=question, response=response_text)
        chat_message.save()

        return JsonResponse({'answer': response_text})
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
