import axios from 'axios';
import { showAlert } from '../utils';

exports.readURL = (input) => {
  if (input.files && input.files[0]) {
    let reader = new FileReader();

    let style = document.createElement('style');

    let profileImage = document.querySelector('.profileImage');
    let profileImageParentElement = profileImage.parentNode;
    profileImageParentElement.removeChild(profileImage);

    reader.onload = function (e) {
      // for the profile image of the overflow
      profileImageParentElement.innerHTML =
        `<img src="${e.target.result}" alt="profile "/>` + profileImageParentElement.innerHTML;
      style.innerHTML = `#profilePicture::before {background:url(${e.target.result}) no-repeat center center/cover;}`;

      document.head.appendChild(style);
    };

    reader.readAsDataURL(input.files[0]);
  }
};

exports.createProfile = async (photoImage, username, description = "Can't talk, WhatsApp only") => {
  try {
    const formData = new FormData();
    formData.append('photo', photoImage);
    formData.append('username', username);
    formData.append('description', description);

    const res = await axios({
      method: 'POST',
      data: formData,
      url: '/api/v1/user/profile',
    });

    if ((res.data.status = 'success')) {
      showAlert('success', 'Every thing is setup 👌👌');
      window.setTimeout(() => {
        location.assign('/contact');
      }, 5000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.error(err.response.data.message);
  }
};
