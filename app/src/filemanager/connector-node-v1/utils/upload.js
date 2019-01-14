import nanoid from 'nanoid';

async function readLocalFile() {
    return new Promise((resolve, reject) => {
        const uploadInput = document.createElement("input");
        uploadInput.setAttribute("multiple", "");

        uploadInput.addEventListener('change', _ => {
            let fileArray = [];

            for (var i = 0; i < uploadInput.files.length; i++) {
                const fileTmp = uploadInput.files[i];
                const fileObj = {
                    type: fileTmp.type,
                    name: fileTmp.name,
                    id: nanoid(),
                    file: fileTmp
                };
                // get item

                fileArray.push(fileObj);
            }

            resolve(fileArray);
        });

        // This input element in IE11 becomes visible after it is added on the page
        // Hide an input element
        uploadInput.style.visibility = 'hidden';

        uploadInput.type = "file";
        document.body.appendChild(uploadInput);
        uploadInput.click();
        document.body.removeChild(uploadInput);
    });
}

export {
    readLocalFile
}
