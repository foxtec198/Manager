import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth,  signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB7Y_AYN7FPbhDaPHhdWMuwPhWK7yYlHH0",
    authDomain: "hubbix-95183.firebaseapp.com",
    projectId: "hubbix-95183",
    storageBucket: "hubbix-95183.appspot.com",
    messagingSenderId: "24681152125",
    appId: "1:24681152125:web:77b8f2f0db36291d143b14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage()
const provider = new GoogleAuthProvider()

try{
    document.getElementById('btnLogin').onclick = function(){
        const email = document.getElementById('email').value
        const pwd = document.getElementById('pwd').value
    
        signInWithEmailAndPassword(auth, email, pwd)
        .then((userC) => {
            const user = userC.user
            
            fetch('/confer_user/'+user.uid).then((res) => {
                if (res.ok) {
                    res.json().then((js) => {
                        sessionStorage.setItem('cr', js.ids[0][0])
                        sessionStorage.setItem('gc', js.ids[0][1])
                        sessionStorage.setItem('mat', js.ids[0][2])
    
                        document.location = '/gourmet/pedidos/' + sessionStorage.getItem('cr')
                    })
                }else{
                    alert(user.uid + ' ' + res.statusText)
                }
            }).catch((error) => {
                toasthbx(error.errorMessage)
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toasthbx(errorMessage)
        })
    }
}catch{}

try{
    document.getElementById('btnGoogle').onclick = function(){
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            
            fetch('/confer_user/' + user.uid)
            .then((res) => {
                if(res.ok){ 
                    res.json().then((js) => {
                        sessionStorage.setItem('cr', js.ids[0][0])
                        sessionStorage.setItem('gc', js.ids[0][1])
                        sessionStorage.setItem('mat', js.ids[0][2])
    
                        document.location = '/gourmet/vendas/' + sessionStorage.getItem('cr')
                    })
                }else{
                    toasthbx(res.statusText)
                }
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            toasthbx(errorMessage)
        });
    }
}catch{}

document.getElementById('btnUploadl').onclick = function(){
    const metadata = {
        contentType: 'image/jpeg'
      };
      
      // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case 'paused':
            console.log('Upload is paused');
            break;
        case 'running':
            console.log('Upload is running');
            break;
        }
    }, 
    (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
        case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
        case 'storage/canceled':
            // User canceled the upload
            break;
    
        // ...
    
        case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
    }, 
    () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        });
    }
    );
}