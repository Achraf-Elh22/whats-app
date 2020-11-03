exports.readURL = (input) => {
  console.log(input);
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    var slidingTagLiAfterStyle = document.createElement('style');

    reader.onload = function (e) {
      slidingTagLiAfterStyle.innerHTML = `#profilePicture::before {background:url(${e.target.result}) no-repeat center center/cover;}`;
      document.head.appendChild(slidingTagLiAfterStyle);
    };

    reader.readAsDataURL(input.files[0]);
  }
};
