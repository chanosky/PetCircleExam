const axios = require('axios');
const tags = require('mocha-tags');
const {
    expect
} = require('chai');
const td = require('./PetCircleExamTestData/testdata.js');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');


describe('Pet Creation API Tests', function() {
    this.timeout(5000); // Adjust timeout if necessary

});
tags('smoke', 'TC 1', 'Create').it('TC-Create-01: Create a valid pet', async function() {
    // generate test data
    console.log('Generated Pet Data:', td.addpet); // the test data for pet generated for comparison
    const requestData = td.addpet;
    petId = td.addpet.id;
    petCategoryName = td.addpet.category.name;
    petName = td.addpet.name;
    petStatus = td.addpet.status;
    petCategoryID = td.addpet.category.id;
    petTags = td.addpet.tags; // Assuming tags is an array, so we need to handle it dynamically

    // create pet
    const response = await axios.post(td.baseurl + '/pet', requestData);
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('id').to.equal(petId);
    expect(response.data.category).to.have.property('name').to.equal(petCategoryName);
    expect(response.data.category).to.have.property('id').to.equal(petCategoryID);
    petTags.forEach((tag, index) => {
        expect(response.data.tags[index]).to.have.property('id').that.equals(tag.id);
        expect(response.data.tags[index]).to.have.property('name').that.equals(tag.name);
    });
    expect(response.data).to.have.property('name').to.equal(petName);
    expect(response.data).to.have.property('status').to.equal(petStatus);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});
tags('smoke', 'TC 2', 'Create').it('TC-Create-02: Create pet with missing mandatory fields', async function() {
    const requestData = {
        "name": null
    };

    try {
        await axios.post(td.baseurl + '/pet', requestData);
        expect.fail('API should return 400');
    } catch (response) {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.data).to.have.property('type').that.includes('error');
        expect(response.data).to.have.property('message').that.includes('name: value should not be accepted');
    }

});
tags('smoke', 'TC 3', 'Create').it('TC-Create-03: Create pet with invalid status', async function() {
    const requestData = {
        id: 2,
        name: "Buddy",
        status: "unknown"
    };
    try {
        await axios.post(td.baseurl + '/pet', requestData);
        expect.fail('API should return 400');
    } catch (response) {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.data).to.have.property('type').that.includes('error');
        expect(response.data).to.have.property('message').that.includes('status: value should not be accepted (only accepts sold, pending and available)');
    }

});
tags('smoke', 'TC 4', 'Create').it('TC-Create-04: Create pet with duplicate ID', async function() {

    // delete pet - should be a pre requisite for the test
    try {
        await axios.delete(td.baseurl + '/pet' + '/' + 1);
    } catch (error) {
        console.log('pet is already deleted');
    }
    const requestData = {
        id: 1,
        name: "Buddy",
        status: "available"
    };
    await axios.post(td.baseurl + '/pet', requestData);

    // test proper
    const requestData2 = {
        id: 1,
        name: "Buddy2",
        status: "available"
    };
    try {
        await axios.post(td.baseurl + '/pet', requestData2);
        expect.fail('API should return 400');
    } catch (response) {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.data).to.have.property('type').that.includes('error');
        expect(response.data).to.have.property('message').that.includes('id: duplicate id should not be accepted');
    }

});
tags('smoke', 'TC 5', 'Create').it('TC-Create-05: Create pet with maximum field lengths', async function() {
    const requestData = {
        id: 9999,
        name: "A".repeat(255), // Maximum allowed length for name
        status: "available"
    };
    try {
        await axios.post(td.baseurl + '/pet', requestData);
        expect.fail('API should return 400');
    } catch (response) {
        console.log(response);
        expect(response.status).to.equal(400);
        expect(response.data).to.have.property('type').that.includes('error');
        expect(response.data).to.have.property('message').that.includes('name: should not exceed 250 chars');
    }
});

tags('smoke', 'TC 6', 'Read').it('TC-Read-01: Retrieve details of an existing pet', async function() {
    // generate test data
    console.log('Generated Pet Data:', td.addpet);
    const requestData = td.addpet;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;
    console.log(petId);

    // retrieve the pet details
    const response = await axios.get(td.baseurl + '/pet' + '/' + petId);
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data.id).to.equal(petId);
    expect(response.data.category.name).to.equal(petCategoryName);
    expect(response.data.name).to.equal(petName);
    expect(response.data.status).to.equal(petStatus);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));
});

tags('smoke', 'TC 7', 'Read').it('TC-Read-02: Retrieve details of a non-existing pet', async function() {
    const petId = 152312;
    try {
        await axios.get(td.baseurl + '/pet' + '/' + petId);
        expect.fail('API returned 404');
    } catch (error) {
        expect(error.response.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('error');
        expect(error.response.data).to.have.property('message').that.includes('Pet not found');
    }

});

tags('TC 8', 'Read').it('TC-Read-03: Retrieve pet details with invalid pet ID format', async function() {
    const petId = 'abc';

    try {
        await axios.get(td.baseurl + '/pet' + '/' + petId);
        expect.fail('API returned an error');
    } catch (error) {
        expect(error.response.status).to.equal(404);
        console.log(error.response.data);
        expect(error.response.data).to.have.property('message').that.includes('java.lang.NumberFormatException: For input string: "abc"');
    }
});

tags('smoke', 'TC 9', 'Read').it('TC-Read-04: Retrieve all pets with status filter - available', async function() {
    const status = 'available';

    const response = await axios.get(td.baseurl + '/pet' + '/' + 'findByStatus?status=' + status);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array').that.is.not.empty;
    response.data.forEach(pet => {
        expect(pet).to.have.property('status', status);
    });
});

tags('smoke', 'TC 10', 'Read').it('TC-Read-05: Retrieve all pets with status filter - sold', async function() {
    const status = 'sold';

    const response = await axios.get(td.baseurl + '/pet' + '/' + 'findByStatus?status=' + status);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array').that.is.not.empty;
    response.data.forEach(pet => {
        expect(pet).to.have.property('status', status);
    });
});

tags('smoke', 'TC 11', 'Read').it('TC-Read-06: Retrieve all pets with status filter - pending', async function() {
    const status = 'pending';

    const response = await axios.get(td.baseurl + '/pet' + '/' + 'findByStatus?status=' + status);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array').that.is.not.empty;
    response.data.forEach(pet => {
        expect(pet).to.have.property('status', status);
    });
});

tags('smoke', 'TC 12', 'Update').it('TC-Update-01: Update data of an existing pet', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const requestData2 = {
        ...requestData,
        name: 'newkitty', // Update the name
        status: 'sold', // Update the status
    };

    const response = await axios.put(td.baseurl + '/pet', requestData2);
    expect(response.data).to.have.property('name').that.includes('newkitty');
    expect(response.data).to.have.property('status').that.includes('sold');
    console.log(response.data);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));    

});

tags('smoke', 'TC 13', 'Update').it('TC-Update-02: Update a non-existing pet', async function() {
    // generate test data
    const requestData = td.sampledata2;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    // delete pet
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

    // update the deleted pet
    try {   
    const requestData2 = {
        ...requestData,
        name: 'newkitty', // Update the name
        status: 'sold', // Update the status
    
    };
    const response = await axios.put(td.baseurl + '/pet', requestData2);
    expect(response.data).to.not.have.property('name').that.includes('newkitty');
    expect(response.data).to.not.have.property('status').that.includes('sold');
    console.log(response.data);
         
    } catch (error) {
        console.log("ERROR: This should be an error because we should not be able to update a non existing pet");
        await axios.delete(td.baseurl + '/pet' + '/' + petId);
        throw error; // Ensure test fails on error        
    }

});

tags('smoke', 'TC 14', 'Update').it('TC-Update-03: Update pet with invalid data', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;


    const requestData2 = {
        ...requestData,
        id: 'letters', // Update the id
        name: 'newkitty', // Update the name
        status: 'invalid', // Update the status
    };
    try {
        await axios.put(td.baseurl + '/pet', requestData2);

    } catch (error) {
        expect(error.status).to.equals(500);
        expect(error.response.data).to.have.property('message').that.includes('something bad happened');
        console.log(error.response.data);
        throw error; // Ensure test fails on error
    }
  

});

tags('smoke', 'TC 15', 'Delete').it('TC-Delete-01: Delete an existing pet', async function() {
    // generate test data
    const requestData = td.sampledata2;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    // delete pet
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 16', 'Delete').it('TC-Delete-02: Delete a non-existing pet', async function() {
    // generate test data
    const requestData = td.sampledata2;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    // delete pet
    await axios.delete(td.baseurl + '/pet' + '/' + petId);

    try {
        await axios.delete(td.baseurl + '/pet' + '/' + petId);
    } catch (error) {
        console.log(error.response.data);
        expect(error.status).to.equal(404);
        console.log('ERROR: Should not be able to delete a non existing object');
        throw error; // Ensure test fails on error
    }

});

tags('smoke', 'TC 17', 'Delete').it('TC-Delete-03: Delete pet with invalid ID format', async function() {
    petId = 'abc';

    try {
        await axios.delete(td.baseurl + '/pet' + '/' + petId);
    } catch (error) {
        console.log(error.response.data);
        expect(error.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('unknown');
        expect(error.response.data).to.have.property('message').that.includes('java.lang.NumberFormatException: For input string: "abc"');
    }

});

tags('smoke', 'TC 18', 'Delete').it('TC-Delete-04: Delete a pet and verify it no longer exists', async function() {
    // generate test data
    const requestData = td.sampledata2;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    // delete pet
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

    // verify the pet no longer exist
    try {
        await axios.get(td.baseurl + '/pet' + '/' + petId);
        expect.fail('API returned 200 for a deleted pet.')
    } catch (error) {
        expect(error.response.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('error');
        expect(error.response.data).to.have.property('message').that.includes('Pet not found');
    }

});

tags('smoke', 'TC 19', 'Delete').it('TC-Delete-05: Delete pet with blank ID', async function() {
    petId = '';

    try {
        await axios.delete(td.baseurl + '/pet' + '/' + petId);
    } catch (error) {
        console.log(error.response.data);
        expect(error.status).to.equal(405);
        expect(error.response.data).to.have.property('type').that.includes('unknown');
    }

});

tags('smoke', 'TC 20', 'UpdateForm').it('TC-UpdateForm-01: Update pet name and status with valid input', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', 'Pet Updated');
    formData.append('status', 'sold');

    // update the pet
    const response = await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // assert the response
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('type').that.includes('unknown');
    expect(response.data).to.have.property('message').that.includes(petId);

    // verify if the pet is updated correctly
    const getresponse = await axios.get(td.baseurl + '/pet' + '/' + petId);
    console.log(getresponse.data);
    expect(getresponse.status).to.equal(200);
    expect(getresponse.data.id).to.equal(petId);
    expect(getresponse.data.name).to.equal('Pet Updated');
    expect(getresponse.data.status).to.equal('sold');

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 21', 'UpdateForm').it('TC-UpdateForm-02: Update only pet status', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('status', 'available');

    // update the pet
    const response = await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // assert the response
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('type').that.includes('unknown');
    expect(response.data).to.have.property('message').that.includes(petId);

    // verify if the pet is updated correctly
    const getresponse = await axios.get(td.baseurl + '/pet' + '/' + petId);
    console.log(getresponse.data);
    expect(getresponse.status).to.equal(200);
    expect(getresponse.data.id).to.equal(petId);
    expect(getresponse.data.status).to.equal('available');

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 22', 'UpdateForm').it('TC-UpdateForm-03: Attempt to update a non-existing pet', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('status', 'available');

    // delete pet
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId))

    // attempt to update the non existing pet

    try {
        await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    } catch (error) {
        console.log(error.response.data);
        expect(error.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('unknown');
        expect(error.response.data).to.have.property('message').that.includes('not found');
    }

    // delete pet to handle garbage data
    const deleteresponse2 = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse2.status).to.equal(200);
    expect(deleteresponse2.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 23', 'UpdateForm').it('TC-UpdateForm-04: Attempt to update with invalid data', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', '55872487529348');
    formData.append('status', '512156123');

    // // update the pet
    // const response = await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    // });

    // // assert the response
    // console.log(response.data);
    // expect(response.status).to.equal(200);   
    // expect(response.data).to.have.property('type').that.includes('unknown');
    // expect(response.data).to.have.property('message').that.includes(petId);

    // // verify if the pet is updated correctly
    // const getresponse = await axios.get(td.baseurl + '/pet' + '/' + petId);
    // console.log(getresponse.data);
    // expect(getresponse.status).to.equal(200);
    // expect(getresponse.data.id).to.equal(petId);
    // expect(getresponse.data.name).to.equal('available');
    // expect(getresponse.data.status).to.equal('available');

    // try catch block if validations will be included in the future
    try {
        // update the pet
        await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        expect.fail('API should return 400');
    } catch (response) {
        console.log(response);
        expect(response.status).to.equal(404);
        expect(response.data).to.have.property('type').that.includes('unknown');
        expect(response.data).to.have.property('message').that.includes('not found');
    }

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 24', 'UpdateForm').it('TC-UpdateForm-05: Attempt to update without providing mandatory petId', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', 'No ID Pet');
    formData.append('status', 'available');

    // update the pet
    try {
        await axios.post(td.baseurl + '/pet/' + null, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        expect.fail('API should return 404');
    } catch (error) {
        console.log(error.response.data);
        expect(error.response.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('unknown');
        expect(error.response.data).to.have.property('message').that.includes('java.lang.NumberFormatException: For input string: "null"');
    }

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 25', 'UpdateForm').it('TC-UpdateForm-06: Attempt to update with invalid petId format', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', 'Bingo');
    formData.append('status', 'pending');

    // update the pet
    try {
        await axios.post(td.baseurl + '/pet/' + 'abc', formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        expect.fail('API should return 404');
    } catch (error) {
        console.log(error.response.data);
        expect(error.response.status).to.equal(404);
        expect(error.response.data).to.have.property('type').that.includes('unknown');
        expect(error.response.data).to.have.property('message').that.includes('java.lang.NumberFormatException: For input string: "abc"');
    }

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 26', 'UpdateForm').it('TC-UpdateForm-07: Update with an empty name field', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', '');
    formData.append('status', 'available');

    // update the pet
    const response = await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // assert the response
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('type').that.includes('unknown');
    expect(response.data).to.have.property('message').that.includes(petId);

    // verify if the pet is updated correctly
    const getresponse = await axios.get(td.baseurl + '/pet' + '/' + petId);
    console.log(getresponse.data);
    expect(getresponse.status).to.equal(200);
    expect(getresponse.data.id).to.equal(petId);
    expect(getresponse.data.name).to.equal(petName);
    expect(getresponse.data.status).to.equal('available');

    // try catch block if validations will be included in the future
    //  try {
    // // update the pet
    //     await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    // });
    //     expect.fail('API should return 400');
    // } catch (response) {
    //     console.log(response);
    //     expect(response.status).to.equal(404);
    //     expect(response.data).to.have.property('type').that.includes('unknown');
    //     expect(response.data).to.have.property('message').that.includes('name: cannot be empty');                
    // }

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('TC 27', 'UpdateForm').it('TC-UpdateForm-08: Attempt to update with extra unexpected parameters', async function() {
    // generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log(requestData);
    petId = pet.data.id;
    petCategoryName = pet.data.category.name;
    petName = pet.data.name;
    petStatus = pet.data.status;

    const formData = new URLSearchParams();
    formData.append('name', '');
    formData.append('status', 'available');
    formData.append('extradata', 'test');

    // update the pet
    const response = await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // assert the response
    console.log(response.data);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('type').that.includes('unknown');
    expect(response.data).to.have.property('message').that.includes(petId);

    // verify if the pet is updated correctly
    const getresponse = await axios.get(td.baseurl + '/pet' + '/' + petId);
    console.log(getresponse.data);
    expect(getresponse.status).to.equal(200);
    expect(getresponse.data.id).to.equal(petId);
    expect(getresponse.data.name).to.equal(petName);
    expect(getresponse.data.status).to.equal('available');

    // try catch block if validations will be included in the future
    //  try {
    // // update the pet
    //     await axios.post(td.baseurl + '/pet/' + petId, formData.toString(), {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    // });
    //     expect.fail('API should return 400');
    // } catch (response) {
    //     console.log(response);
    //     expect(response.status).to.equal(404);
    //     expect(response.data).to.have.property('type').that.includes('unknown');
    //     expect(response.data).to.have.property('message').that.includes('extradata: unsupported field');                
    // }

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 28', 'UploadImage').it('TC-UploadImage-01: Upload image with valid petId, metadata, and image', async () => {

    // Generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log('Pet Created:', pet.data);
    const petId = pet.data.id;
    const fileName = 'cat.jpeg';
    const metaData = 'Sample metadata';
    const folderPath = './PetCircleExamTests/PetCircleExamTestData/PetImages'; // Replace with the path to your folder
    const filePath = path.join(folderPath, fileName);

    async function uploadPetImagesFromFolder(petId, folderPath) {
        const formData = new FormData();

        try {
            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Folder not found: ${folderPath}`);
            }

            // Ensure the specific file exists in the folder
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                formData.append('file', fs.createReadStream(filePath));
            } else {
                throw new Error(`File not found: ${filePath}`);
            }

            // Append additional metadata (optional)
            formData.append('additionalMetadata', metaData);

            // Make the API request
            const response = await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
                headers: {
                    ...formData.getHeaders(), // Important for multipart form headers
                },
            });

            console.log('Upload Response:', response.data);

            // Assertions
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.contains(fileName);
            expect(response.data).to.have.property('message').that.contains(metaData);
        } catch (error) {
            console.error('Error uploading pet images:', error.message);
            throw error; // Ensure test fails on error
        }
    }

    // Example usage
    await uploadPetImagesFromFolder(petId, folderPath);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 29', 'UploadImage').it('TC-UploadImage-02: Upload image with valid petId and no metadata', async () => {

    // Generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log('Pet Created:', pet.data);
    const petId = pet.data.id;
    const fileName = 'cat.jpeg';
    const folderPath = './PetCircleExamTests/PetCircleExamTestData/PetImages'; // Replace with the path to your folder
    const filePath = path.join(folderPath, fileName);

    async function uploadPetImagesFromFolder(petId, folderPath) {
        const formData = new FormData();

        try {
            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Folder not found: ${folderPath}`);
            }

            // Ensure the specific file exists in the folder
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                formData.append('file', fs.createReadStream(filePath));
            } else {
                throw new Error(`File not found: ${filePath}`);
            }

            // Make the API request
            const response = await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
                headers: {
                    ...formData.getHeaders(), // Important for multipart form headers
                },
            });

            console.log('Upload Response:', response.data);

            // Assertions
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.contains(fileName);
            expect(response.data).to.have.property('message').that.contains('additionalMetadata: null');
        } catch (error) {
            console.error('Error uploading pet images:', error.message);
            throw error; // Ensure test fails on error
        }
    }

    // Example usage
    await uploadPetImagesFromFolder(petId, folderPath);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 30', 'UploadImage').it('TC-UploadImage-03: Upload image with invalid petId', async () => {

    const petId = 'abc';
    try {
        const formData = new FormData();

        // Make the API request
        await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
            headers: {
                ...formData.getHeaders(), // Important for multipart form headers
            },
        });
    } catch (error) {
        console.error('Error uploading pet images:', error.message);
        console.log(error.response.data)
        expect(response.status).to.equal(400)
        expect(response.data).to.have.property('type').that.includes('unknown');
        expect(response.data).to.have.property('message').that.includes('org.jvnet.mimepull.MIMEParsingException: Missing start boundary');
    }

});

tags('smoke', 'TC 31', 'UploadImage').it('TC-UploadImage-04: Upload image with invalid file type', async () => {

    // Generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log('Pet Created:', pet.data);
    const petId = pet.data.id;
    const fileName = 'textdoc.txt';
    const metaData = 'Sample metadata';
    const folderPath = './PetCircleExamTests/PetCircleExamTestData/PetImages'; // Replace with the path to your folder
    const filePath = path.join(folderPath, fileName);

    async function uploadPetImagesFromFolder(petId, folderPath) {
        const formData = new FormData();

        try {
            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Folder not found: ${folderPath}`);
            }

            // Ensure the specific file exists in the folder
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                formData.append('file', fs.createReadStream(filePath));
            } else {
                throw new Error(`File not found: ${filePath}`);
            }

            // Append additional metadata (optional)
            formData.append('additionalMetadata', metaData);

            // Make the API request
            const response = await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
                headers: {
                    ...formData.getHeaders(), // Important for multipart form headers
                },
            });

            console.log('Upload Response:', response.data);

            // Assertions
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.contains(fileName);
            expect(response.data).to.have.property('message').that.contains(metaData);
        } catch (error) {
            console.error('Error uploading pet images:', error.message);
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.include('Invalid file type');
            throw error; // Ensure test fails on error
        }
    }

    // Example usage
    await uploadPetImagesFromFolder(petId, folderPath);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});


tags('TC 33', 'UploadImage').it('TC-UploadImage-05: Upload image with no file provided', async () => {

    // Generate test data
    const requestData = td.sampledata;
    const pet = await axios.post(td.baseurl + '/pet', requestData);
    console.log('Pet Created:', pet.data);
    const petId = pet.data.id;
    const fileName = '';
    const metaData = 'Sample metadata';
    const folderPath = './PetCircleExamTests/PetCircleExamTestData/PetImages'; // Replace with the path to your folder
    const filePath = path.join(folderPath, fileName);

    async function uploadPetImagesFromFolder(petId, folderPath) {
        const formData = new FormData();

        try {
            // Check if the folder exists
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Folder not found: ${folderPath}`);
            }

            // Ensure the specific file exists in the folder
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                formData.append('file', fs.createReadStream(filePath));
            } else {
                throw new Error(`File not found: ${filePath}`);
            }

            // Append additional metadata (optional)
            formData.append('additionalMetadata', metaData);

            // Make the API request
            const response = await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
                headers: {
                    ...formData.getHeaders(), // Important for multipart form headers
                },
            });

            console.log('Upload Response:', response.data);

            // Assertions
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('message').that.contains(fileName);
            expect(response.data).to.have.property('message').that.contains(metaData);
        } catch (error) {
            console.error('Error uploading pet images:', error.message);
            expect(error.response.status).to.equal(400);
            expect(error.response.data.message).to.include('Invalid file type');
            throw error; // Ensure test fails on error
        }
    }

    // Example usage
    await uploadPetImagesFromFolder(petId, folderPath);

    // delete pet to handle garbage data
    const deleteresponse = await axios.delete(td.baseurl + '/pet' + '/' + petId);
    expect(deleteresponse.status).to.equal(200);
    expect(deleteresponse.data.message).to.equal(String(petId));

});

tags('smoke', 'TC 34', 'UploadImage').it('TC-UploadImage-06: Upload image with no petId', async () => {

    const petId = null;
    try {
        const formData = new FormData();

        // Make the API request
        await axios.post(td.baseurl + '/pet/' + petId + '/uploadImage', formData, {
            headers: {
                ...formData.getHeaders(), // Important for multipart form headers
            },
        });
    } catch (error) {
        console.error('Error uploading pet images:', error.message);
        console.log(error.response.data)
        expect(error.response.status).to.equal(400)
        expect(error.response.data).to.have.property('type').that.includes('unknown');
        expect(error.response.data).to.have.property('message').that.includes('org.jvnet.mimepull.MIMEParsingException: Missing start boundary');
    }

});