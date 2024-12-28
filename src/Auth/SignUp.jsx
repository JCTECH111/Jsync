import { PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { Storage } from 'appwrite'; 
import { client, ID, account } from '../lib/appwrite';
import { ToastContainer, toast } from 'react-toastify';
import { registerUserWithMetadata } from '../lib/mainSignup';// the main imported backend function
import getCurrentDate from '../components/currentDate';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';


const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
export default function SignUp() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [fname, setFirstName] = useState('');
  const [sname, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Set the username and register the user
  const userName = `${fname} ${sname}`;
const storage = new Storage(client);
const imageId = ID.unique()



async function sendEmailVerification() {
    try {
        const response = await account.createVerification('https://jsync.vercel.app/verify');
        console.log("Verification email sent:", response);
        alert("A verification email has been sent to your email address. Please check your inbox.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        alert("Error sending verification email. Please try again later.");
    }
}
// Function to upload image
 const uploadAvatar = async (file) => {
  try {
  
    // Upload the file to Appwrite Storage
    const response = await storage.createFile(
      bucketId, // Replace with your bucket ID
      imageId,
      file,
    );
    

    console.log('File uploaded successfully:', response);
    
    // Return the file URL or file ID to store in the metadata
    return response.$id;  // File ID
  } catch (error) {
    showErrorMessage('Error uploading Image:', error);
    throw error;
  }
};

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check for valid image file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        showErrorMessage('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      
      setAvatar(file)
      // Log avatar and username for debugging
      console.log(avatar, userName);
    }
  };
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordMatch(value === confirmPassword);

    if (!validatePassword(value)) {
        setPasswordError(
          'Password must be at least 8 characters long, include one number, and one special character.'
        );
      } else {
        setPasswordError('');
      }
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsPasswordMatch(e.target.value === password);
  };
  //getting the current date
  const currentDate = getCurrentDate();
  const submitForm = async (e) => {
    e.preventDefault();

    // Check for validation errors
    if (!fname || !sname || !email || !password || !confirmPassword || !avatar) {
        showErrorMessage('Please fill out all fields.');
        return;
    }

    if (passwordError || !isPasswordMatch) {
        showErrorMessage('Please resolve all errors before submitting.');
        return;
    }

    try {
      setIsSubmitting(true);
  
      // Upload avatar
      await uploadAvatar(avatar);
      if (!imageId ) {
        showErrorMessage("Invalid file upload response or missing $id");
    }
      // const fileId = fileUploadResponse.$id;
     console.log(imageId)
      // Register user
      await registerUserWithMetadata(
          email,
          password,
          userName,
          0,
          "free",
          currentDate,
          0,
          imageId
      );
      // Step 2: Create a temporary session for the user
      await account.createEmailPasswordSession(email, password);
      showSuccessMessage("Temporary session created");
      // Simulate a loading or splash screen effect
  
      sendEmailVerification()
  
      // Success
      showSuccessMessage("User registered successfully!");
  } catch (error) {
      if (error.message.includes("file")) {
          showErrorMessage("Error uploading avatar.");
      } else if (error.message.includes("metadata")) {
          showErrorMessage("Error registering user metadata.");
      } else {
          showErrorMessage("An unexpected error occurred.");
      }
      console.error("Error:", error);
  } finally {
      setIsSubmitting(false);
  }
  
    
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <form onSubmit={submitForm} className="w-full max-w-[30rem] flex flex-col items-center bg-white p-8 rounded-lg  space-y-4">
    <ToastContainer />
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
        <p className="text-sm text-gray-600 text-center">Fill in your details to create an account</p>

        {/* Profile Picture */}
        <div className="relative flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <PhotoIcon className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profile-pic"
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md cursor-pointer hover:bg-blue-500"
          >
            Upload Picture
          </label>
          <input
            id="profile-pic"
            type="file"
            accept="image/*"
            name='avatar'
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Inputs */}
        <div className="w-full space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={fname}
              onChange={e => setFirstName(e.target.value)}
              name='First-Name'
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              value={sname}
              onChange={e => setSecondName(e.target.value)}
              name='Second-Name'
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              name='email'
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name='password'
              value={password}
              onChange={handlePasswordChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
            {password && (
              <div className="absolute right-3 top-7">
                {!passwordError ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
            {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
            {confirmPassword && (
              <div className="absolute right-3 top-7">
                {isPasswordMatch ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
            {!isPasswordMatch && <p className="text-red-500 text-sm">Passwords do not match</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center space-x-4">
          <button
            type="button"
            className="w-full py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        {isSubmitting ? 'Submitting...' : 'Sign Up'}
      </button>
        </div>
      </form>
      <p className="mt-6 text-center text-xl text-gray-500">
      Already had an account? {' '}
      <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-500">SignIn</Link>
    </p>
    </div>
  );
}
