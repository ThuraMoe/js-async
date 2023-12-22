const fileSelector = document.getElementById("inputFile");
const renderContainer = document.getElementById("file-content");

// read file content when file is choose
fileSelector.addEventListener('change', function(event) {
    const fileList = event.target.files;

    // promisifying
    readFileContent(fileList)
        .then(res => renderContainer.innerText = res)
        .catch(err => renderContainer.innerText = err.message)
});

// file reader with promise
const readFileContent = (files) => {
    return new Promise((resolve, reject) =>  {
        const file = files[0];
        if(file.size == 0) reject(new Error('Empty File'))
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result);
        reader.error = (err) => reject(err);
        reader.readAsText(file)
    });
}


