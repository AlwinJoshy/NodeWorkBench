const fs = require('fs');


console.log("Started...");


let jsonFilePath = "./Assets/jsonFile/highstreet-market-default-rtdb-export.json"
let jsonData = null;
let homeObjectKeys = null;
let newFile = {};


const AddNftInstance = (customData, relations) => {
  let nftInstance =
  {
    instances:
      [
        {
          customData: customData,
          relations: relations,
        }
      ]
  }
  return nftInstance;
}

const NFTList = (userObject) => {
  for (let index = 0; index < userObject.homes.length; index++) {
    let oldHome = jsonData.homes[userObject.homes[index]];

    let nftListOfHome = oldHome.nftitem;

    if (nftListOfHome == null) break;

    for (let n = 0; n < nftListOfHome.length; n++) {
      // constructing nft
      let oldNFTData = nftListOfHome[n];
      if (oldNFTData == null) continue;

      let firstTwoChar;

      try {
        firstTwoChar = oldNFTData.id.substring(0, 2);// 0x
      } catch (error) {
        console.log(nftListOfHome);
        throw error;
      }



      if (firstTwoChar == "0x") {

        let newNFTObject = AddNftInstance(
          {
            position: oldNFTData.position,
            rotation: oldNFTData.rotation
          },
          {
            parent: `${userObject.homes[index]}@0`
          }
        )

        // add child nft
        userObject.nfts[oldNFTData.id] = newNFTObject;

        // add child to home
        userObject.nfts[userObject.homes[index]].instances[0].relations.children.push(`${oldNFTData.id}@0`);
      }
    }
  }

  //userObject.nfts = nftObject;

  delete userObject.homes;

}

const HomeNFTList = (walletID, userObject) => {

  if (homeObjectKeys == null) homeObjectKeys = Object.keys(jsonData.homes);
  let nftObject = {}
  let homeList = [];

  for (let index = 0; index < homeObjectKeys.length; index++) {
    let homeData = jsonData.homes[homeObjectKeys[index]];

    if (homeData.ownerWallet.toLowerCase() == walletID.toLowerCase()) {

      let nftHomeInstance = AddNftInstance(
        {
          furniture: homeData.furniture,
          password: homeData.password
        },
        {
          children: []
        });

      nftObject[homeObjectKeys[index]] = nftHomeInstance

      homeList.push(homeObjectKeys[index]);
    }
  }

  userObject["homes"] = homeList;
  userObject.nfts = nftObject;
}


const Initialize = (userData) => {
  let userProfile =
  {
    nfts: {},
    profile: {
      avatarID: userData.userAvatarID,
      userID: userData.userId,
      username: userData.username
    }
  };
  return userProfile;
}

const Parser = () => {

  jsonData = ReadJSONData(jsonFilePath);

  newFile.users = {};
  // go through all the users

  let userKeys = Object.keys(jsonData.users);

  for (let index = 0; index < userKeys.length; index++) {

    let userData = jsonData.users[userKeys[index]];

    let userProfile = Initialize(userData);
    newFile.users[userKeys[index]] = userProfile;
  }

  let userKeyList = Object.keys(newFile.users);

  // adding homes
  for (let index = 0; index < userKeyList.length; index++) {
    let key = userKeyList[index];
    HomeNFTList(key, newFile.users[key]);
  }

  // adding nfts
  for (let index = 0; index < userKeyList.length; index++) {
    let key = userKeyList[index];
    NFTList(newFile.users[key]);
  }

  WriteJSONData(newFile, "C:/Users/flame/OneDrive/Desktop/New folder/output.json");

}


const ReadJSONData = (filePath) => {
  let rawdata = fs.readFileSync(filePath);
  return JSON.parse(rawdata);
}

const WriteJSONData = (jsonData, filePath) => {
  let data = JSON.stringify(jsonData);
  fs.writeFileSync(filePath, data);
}

Parser();