# SubmitPayForBlob
# This project demonstrates how to submit a Pay for Blob (PFB) transaction on the Celestia Testnet using Keplr wallet and a simple web interface. It consists of a frontend application built with HTML, CSS, and JavaScript, and a backend server built with Node.js and Express.
# DEMO

     http://207.244.225.191:8081/#

Before you begin, make sure you have the following software installed on your system:

Node.js (version 16.x)
npm (version 8.x)
Keplr wallet browser extension
# Getting Started
Clone the repository:

     git clone https://github.com/andreyT25/SubmitPayForBlob.git

Go to the project directory:

     cd SubmitPayForBlob

Install the necessary dependencies:

     npm install
  
Open your browser and go to http://localhost:8081

Connect your Keplr wallet to the application by clicking the "Connect" button.

Fill out the form and click the "Submit" button to submit a PFB transaction.

Using PM2
# To run the project using PM2, a production process manager for Node.js applications, follow these steps:

Install PM2 globally:

     npm install -g pm2

# Run your app by running the command:

     npm run dev

Now your app will run 24/7 even when you close the terminal. To check the status of your application, use the following command:


    pm2 status

If you want to stop your application, use the command:

   pm2 stop all

To restart your application:

    pm2 restart all

This will allow your application to run 24/7 even when the terminal is closed.
For more information on how to use PM2, refer to the official documentation.

Components
The project uses the following components:

Frontend

HTML and CSS for the user interface
JavaScript for handling user input and processing the PFB transaction
Keplr wallet for managing user accounts and signing transactions
Backend

Node.js for running the server
Express for creating the server and handling HTTP requests
node-fetch for making HTTP requests from the server
body-parser for parsing incoming request bodies
cors for enabling Cross-Origin Resource Sharing (CORS)
cluster for running the server across multiple CPU cores
path for working with file and directory paths
