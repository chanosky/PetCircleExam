# API Automation Test for Petstore App

*This API Automation script uses the Mocha Framework, Chai.js and Axios to automate the PetStore app - this only includes the PET endpoints excluding the GET /pet/findByTags endpoint* 

**The script will test the Petstore PET endpoints by using a variety of test cases including:**

	 TC-Create-01: Create a valid pet
	 TC-Create-02: Create pet with missing mandatory fields
	 TC-Create-03: Create pet with invalid status
	 TC-Create-04: Create pet with duplicate ID
	 TC-Create-05: Create pet with maximum field lengths
	 TC-Read-01: Retrieve details of an existing pet
	 TC-Read-02: Retrieve details of a non-existing pet
	 TC-Read-03: Retrieve pet details with invalid pet ID format
	 TC-Read-04: Retrieve all pets with status filter - available
	 TC-Read-05: Retrieve all pets with status filter - sold
	 TC-Read-06: Retrieve all pets with status filter - pending
	 TC-Update-01: Update data of an existing pet
	 TC-Update-02: Update a non-existing pet
	 TC-Update-03: Update pet with invalid data
	 TC-Delete-01: Delete an existing pet
	 TC-Delete-02: Delete a non-existing pet
	 TC-Delete-03: Delete pet with invalid ID format
	 TC-Delete-04: Delete a pet and verify it no longer exists
	 TC-Delete-05: Delete pet with blank ID
	 TC-UpdateForm-01: Update pet name and status with valid input
	 TC-UpdateForm-02: Update only pet status
	 TC-UpdateForm-03: Attempt to update a non-existing pet
	 TC-UpdateForm-04: Attempt to update with invalid data
	 TC-UpdateForm-05: Attempt to update without providing mandatory petId
	 TC-UpdateForm-06: Attempt to update with invalid petId format
	 TC-UpdateForm-07: Update with an empty name field
	 TC-UpdateForm-08: Attempt to update with extra unexpected parameters
	 TC-UploadImage-01: Upload image with valid petId, metadata, and image
	 TC-UploadImage-02: Upload image with valid petId and no metadata
	 TC-UploadImage-03: Upload image with invalid petId
	 TC-UploadImage-04: Upload image with invalid file type
	 TC-UploadImage-05: Upload image with no file provided
	 TC-UploadImage-06: Upload image with no petId


# Prerequisites

Here are the prerequisites in order to run the script:

 - [ ] git 2.33.0.windows.2 or latest should be installed for windows in order to take advantage of git commands in the command line
 - [ ] nodejs v22.13.0 or latest, should be built in with the latest "npm"
 - [ ] Mocha.js v10.2.0 or latest (will automatically be installed using the package.json file)
 - [ ] Axios v^1.7.9 or latest (will automatically be installed using the package.json file)
 - [ ] Chai.js v5.1.2 or latest (will automatically be installed using the package.json file)
 - [ ] Mocha Tags v1.0.1 or latest (will automatically be installed using the package.json file)
 - [ ] Mochawesome v7.1.3 or latest (will automatically be installed using the package.json file)
 - [ ] Cross-env v7.1.3 or latest (will automatically be installed using the package.json file)
 - [ ] Form Data v4.0.1 or latest (will automatically be installed using the package.json file)

 Another important prerequisite in order for us to run the script is to have the Best Buy API Playground app running in the background. This can be achieved by the following steps.

 1. Install NodeJS on your system. You can download the latest version from the official website: https://nodejs.org/en/download/.
 2. Open the installer and follow the prompts to install the Node.js. By default, the installer uses the Node.js distribution in C:\Program Files\nodejs. The installer should set the C:\Program Files\nodejs\bin directory in Window's PATH environment variable. Restart any open command prompts for the change to take effect.
 3. Verify installation is successful by running `node -v` in command line, verify npm is also available by running `npm -v`in the command line as well. Both should show their respective versions.

## How to run the API Automation Test

Please see below the step-by-step procedure for fetching the API Automation Test suite for PetStore from GitHub, installing the necessary requirements, and running the script using the command line:

1. Open a command prompt or terminal window and navigate to the directory where you want to store the script.
2. Use the command `git clone` followed by the repository url to fetch the script from GitHub, for example: `https://github.com/chanosky/PetCircleExam.git` or just download the repository to your desired location.
3. Navigate into the cloned repository (make sure you are in the `/PetCircleExamTests` folder.)
4. Install the necessary requirements by running the command `npm install`
5. The test has multiple ways to run the automation tests, see commands below:

		 - npm run readtests
			 - used to run read/get tests
		 - npm run createtests
			 - used to run add pets to store tests
		 - npm run deletetests
			 - used to run delete tests
		 - npm run updatetests
			 - used to run update tests
		 - npm run updateformtests
			 - used to run updateform tests
		 - npm run uploadimagetests
			 - used to run upload image tests
		 - npm run smoketests
			 - used to run tests tagged as smoke
		 - npm run alltests
			 - used to run all tests

 6. There will be an html file and a json file which will be generated in the directory for the user to check the result of the test.
		

## Limitations

This script has the following limitations:

1. The script has only been tested on a Windows 11 operating system. There may be compatibility issues when running the script on other operating systems such as MacOS, Linux, etc. 
       
2. CI/CD for this script was not yet set up. But I built a basic github actions workflow.
    
It is important to keep these limitations in mind when using this script and to thoroughly test the script on different operating systems before using it.

> Do not change anything inside the folders, check the commented variables inside `\testdata.js`, you can play around with this test data file but changing any variables might incur errors when running.
> I also created a function to randomize adding pets.

## Bugs and issues found

1. There are no validations for the fields yet, testing the boundary values for max and min length is not supported.

2. The name of the pets accepts any characters, this should not be the case and this is not supported yet.

3. The status of the pet accepts any string as well, this is not coinciding with the get request findbyStatus endpoint in which it should only accept available, sold and pending.
	
4. The upload endpoint accepts any file type, should only accept png or jpg.

5. Maximum and minimun file size in the upload endpoint is not configured yet, this is not supported as well.

6. The update (PUT) endpoints has many issues, users can update even if the ID is not specified

7. Required fields are not yet specified too.
