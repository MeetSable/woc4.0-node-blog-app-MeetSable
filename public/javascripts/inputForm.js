window.onload = function(){
    const bannerInp = document.getElementById('bannerInp');
    const img = document.getElementById('preview');
    bannerInp.addEventListener('change', previewImage, false);
    
    function previewImage(){
        var file = bannerInp.files;
        if (file != null){
            var reader = new FileReader();
            reader.onload = function(event){
                img.setAttribute('src',event.target.result);
            }
            reader.readAsDataURL(file[0]);
        }
    }
    
    const imgRadio = document.getElementById('bannerFlag');
    imgRadio.addEventListener('change', showHideImginp, false);

    function showHideImginp(){
        if (imgRadio.checked){
            document.getElementById('imgInp').style.display = 'block';
        }else{
            document.getElementById('imgInp').style.display = 'none';
        }
    }

    const gistTextArea = document.getElementById('gistOfBlog');
    gistTextArea.addEventListener('input',({ currentTarget: target })=>{
        const maxLength = target.getAttribute("maxlength");
        const currentLength = target.value.length;
        document.getElementById('charNum')
        .innerHTML =`${maxLength - currentLength} characaters remaining`;
    });

    const fileChosen = document.getElementById('file-chosen');
    bannerInp.addEventListener('change', function(){
        fileChosen.textContent = this.files[0].name;
    });

};