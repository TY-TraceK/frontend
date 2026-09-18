import apiClient from '@/api/apiClient.js';

const UserService = {
  async getUserProfileData() {
    const response = await apiClient.get('/users/me');
    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
  async getUserActivityProjection() {
    const response = await apiClient.get('/users/me/projection');
    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async updateUserProfileData(formData) {
    const response = await apiClient.post('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default UserService;
