from rest_framework import serializers
from .models import User
from connections.models import FriendRequest
import imageio
from PIL import Image
import io

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image']

class FriendRequestSenderOnlySerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer()

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'status', 'created_at']

class ProfileImageSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=True)

    class Meta:
        model = User
        fields = ['profile_image']

    def validate_profile_image(self, value):
        if value:
            try:
                # Check if the uploaded file is an image
                img = Image.open(value)
                img.verify()
            except (IOError, SyntaxError) as e:
                try:
                    # Handle AVIF files using imageio
                    value.seek(0)
                    img = imageio.imread(value.read(), format='avif')
                except Exception:
                    raise serializers.ValidationError("Invalid image format or corrupted image.")
        return value

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserBasicSerializer()
    receiver = UserBasicSerializer()

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    sent_friend_requests = FriendRequestSerializer(many=True, read_only=True)
    received_friend_requests = FriendRequestSerializer(many=True, read_only=True)
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_student', 'is_senior', 
                  'friends','password', 'sent_friend_requests', 'received_friend_requests', 'profile_image']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_friends(self, obj):
        friends = obj.friends.all()
        return UserBasicSerializer(friends, many=True).data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        profile_image = validated_data.pop('profile_image', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        if profile_image:
            user.profile_image = profile_image
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.is_student = validated_data.get('is_student', instance.is_student)
        instance.is_senior = validated_data.get('is_senior', instance.is_senior)
        profile_image = validated_data.get('profile_image')
        password = validated_data.get('password')
        if profile_image:
            instance.profile_image = profile_image
        if password:
            instance.set_password(password)
        instance.save()
        return instance
