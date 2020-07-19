'use strict'

const fs = require('fs');
let userData = require('./user_data.json');


exports.addCategory = function(cat) {
	if (exports.categoryExists(cat)) {
		exports.logError('Category ' + cat + ' already exists.');
		return;
	}

	userData.categories.add(cat);
}

exports.incrementData = function(user, cat) {
	if (!exports.categoryExists(cat)) {
		console.logError('Category ' + cat + ' does not exist.');
		return;
	}

	const validUser = exports.userExists(user);

	if (validUser >= 0) {
		const trackingCat = exports.userTrackingCat(validUser, cat);
		if (trackingCat >= 0) {
			userData.entries[validUser].data[trackingCat].count++;
			exports.log(cat + ' was updated on user ' + user);
		}
		else {
			exports.addUserCat(validUser, cat)
			exports.log(cat + 'was added on user ' + user);
		}
	}
	else {
		exports.addUser(user);
		exports.log('New user ' + user + ' was created');
		exports.addUserCat(userData.entries.length - 1, cat);
	}

	exports.saveUserData();
}

exports.categoryExists = function(cat) {
	if (userData.categories.includes(cat)) return true;
	return false;
}

exports.userExists = function(user) {
	for (let entry = 0; entry < userData.entries.length; entry++)
		if (userData.entries[entry].name === user)
			return entry;
	return -1;
}

exports.userTrackingCat = function(userIndex, cat) {
	for (let category = 0; category < userData.entries[userIndex].data.length; category++)
		if (userData.entries[userIndex].data[category].category === cat)
			return category;
	return -1;
}

exports.addUser(user) {
	let newUser = require('./user_template.json');
	newUser.name = user;
	userData.entries.push(newUser);
}

exports.addUserCat(userIndex, cat) {
	let newUserCat = require('./category_template.json');
	newUserCat.category = cat;
	newUserCat.count = 1;
	userData.entries[userIndex].data.push(newUserCat);
}

exports.saveUserData = function(bak) {
	let fileName = __dirname + '/user_data.json';
	if (bak) {
		fileName += '.bak';
		exports.log('user_data.json has been backed up to user_data.json.bak');
	}  
	fs.writeFile(fileName, JSON.stringify(userData, null, 2), err => {
	    if (err) {
	      exports.logFatal(`There was an error saving user_data.json...`);
	      throw err;
	    }
	  });
	exports.log('user_data.json has been udpated.')
}

exports.log = function(msg) {
	const pref = 'udh ~ ';
	console.log(pref + msg);
}

exports.logError = function(msg) {
	const pref = 'udh ~ ERROR: ';
	console.log(pref + msg);
}

exports.logFatal = function(msg) {
	const pref = 'udh ~ FATAL: ';
	console.log(pref + msg);
}