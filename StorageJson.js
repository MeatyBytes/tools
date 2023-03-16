// Outputs a providers storage metadata in Storage.json format.
// Primary use is for providers upgrading from basic to full licence xa-miner UnRaid container.
// When upgrading from basic licence through the installer, the Storage.json file will be generated for you.
// However, you may also upgrade to the full version xa-miner UnRaid container without using the installer.
// By using the UnRaid container, it will also alow you to upgrade like any other container.
// Without having to download the installer again.
//
// But the docker image doesn't provide you with a Storage.json file in this case.  Use this script
// to create the Storage.json file.
//
// This script can alo be used to regenerate your Storage.json file, for whatever other reason.

// Copy this script to xa-miner container path /root
// You may also use vi editor and cut and paste directly into the editor instead.
 
// Parameters:
// diskPath : Specify the diskPath value you wish to include in the output

// Usage:
// Output to console
// node StorageJson /mnt/user/scp-storage/
//
// Create or regenerate Storage.json
// node StorageJson /mnt/user/scp-storage/ > /root/scprime/storage.json

const http = require('http');
var diskPath = "/mnt/user";

if (process.argv.length > 2)
{
    diskPath = process.argv[2];
}

const options = {
    URL : "http://localhost:4280/host",
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': "ScPrime-Agent"
    }
  }

class Folder {
  constructor(folder_host, folder_container,folder_diskPath,folder_free,folder_size) {
      this.host = folder_host,
      this.container = folder_container,
      this.diskPath = folder_diskPath,
      this.free = folder_free,
      this.size = folder_size
  }
}
  
http.get('http://localhost:4280/host/storage',options, res => {

  let data = [];
  
  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {    
    const folders = JSON.parse(Buffer.concat(data).toString());

    var folder;
    var storage = [];
   
    for (folder of folders.folders)
    {
      const newfolder = new Folder(folder.path,folder.path,diskPath,folder.capacityremaining,folder.capacity);
      storage.push(newfolder);
    }

    const output = {
      "storage" : storage
    }

    const obj = JSON.stringify(output,null,4);
    console.log(obj);
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});