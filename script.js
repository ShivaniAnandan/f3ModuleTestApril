const getBtn = document.getElementById('get-data');
const infoContainer = document.querySelector('.loc-container');
const pinContainer = document.querySelector('.pincode-container');
const postOfficeContainer = document.querySelector('.postoffice-container');
const lat = document.getElementById('lat');
const long = document.getElementById('long');
const city = document.getElementById('city');
const region = document.getElementById('region');
const organisation = document.getElementById('organisation');
const hostname = document.getElementById('hostname');
const map = document.getElementById('map');
const x = document.getElementById('x');
const timeZone = document.getElementById('time-zone');
const dateTime = document.getElementById('date-time');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');
const search = document.getElementById('search');


var IP;
var dataJson;
var latitude;
var longitude;
var pin;

var postOfficeArr=[];

fetch('https://api.ipify.org?format=json')
.then((resp)=>resp.json())
.then((data)=>{
    console.log(data.ip);
    IP=data.ip;
    document.getElementById('ip').innerText = data.ip;
}).catch((e)=>{
    console.log("Error while fetching Ip address",e);
})

getBtn.addEventListener('click',()=>{
        console.log('hello');
        setTimeout(() => {
            fetch(`https://ipinfo.io/${IP}/geo?token=6ee0ffb1188679`)
            .then((resp)=>resp.json())
            .then((data)=>{
                dataJson=data;
                console.log("data",dataJson);
                let location=dataJson.loc;
                latitude = location.split(',')[0];
                longitude = location.split(',')[1];
                lat.innerHTML = `<strong>Lat: </strong>${latitude}`;
                long.innerHTML = `<strong>Long: </strong>${longitude}`;
                city.innerHTML = `<strong>City: </strong>${dataJson.city}`;
                region.innerHTML = `<strong>Region: </strong>${dataJson.region}`;
                organisation.innerHTML = `<strong>Organisation: </strong>${dataJson.org}`;
                hostname.innerHTML = `<strong>Hostname: </strong>${dataJson.hostname}`;
    
                map.setAttribute('src',`https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&amp&output=embed`);
    
                let datetime_str = new Date().toLocaleString("en-US", { timeZone: `${dataJson.timezone}` });
                timeZone.innerHTML = `<strong>Time Zone: </strong>${dataJson.timezone}`;
                dateTime.innerHTML = `<strong>Date And Time: </strong>${datetime_str}`;
                pin = dataJson.postal;
                pincode.innerHTML = `<strong>Pincode: </strong>${dataJson.postal}`;
                postOffice(pin);
    
            })
            .catch((e)=>console.log('Error',e))

           

        }, 1000);


        getBtn.style.display='none';
        infoContainer.style.display='flex';
        pinContainer.style.display='block';
})

function postOffice(pin) {
    console.log(pin);
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
    .then((resp)=>resp.json())
    .then((data)=>{
        console.log(data[0]);
        message.innerHTML = `<strong>Message: </strong>${data[0].Message}`;
        console.log(data[0].PostOffice);
        postOfficeArr = data[0].PostOffice;
        search.style.display='block';

        showPostOffice(postOfficeArr);
    })
    .catch((e)=>{
        console.log("Error",e);
    })
    
}

function showPostOffice(Arr) {
    postOfficeContainer.innerHTML='';
    let myHtml='';
    Arr.forEach((ele)=>{
        myHtml+=`
        <div class="postoffice-content">
         <div><strong>Name:</Strong> ${ele.Name}</div>
         <div><strong>Branch Type:</Strong> ${ele.BranchType}</div>
         <div><strong>Delivery Status:</Strong> ${ele.DeliveryStatus}</div>
         <div><strong>District:</Strong> ${ele.District}</div>
         <div><strong>Division:</Strong> ${ele.Division}</div>
        </div>
        `
    })
    postOfficeContainer.innerHTML=myHtml;
}


search.addEventListener('input',()=>{
    var filterArr = postOfficeArr.filter((ele)=>{
        if(ele.Name.toLowerCase().includes(search.value.trim().toLowerCase())){
            return ele;
        }
    })
    showPostOffice(filterArr);
})