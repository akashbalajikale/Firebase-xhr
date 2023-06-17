let cl =console.log;


const postContainer = document.getElementById('postContainer')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('content')
const createpost = document.getElementById('createpost')
const postform =document.getElementById('postform')
const upDatebtn =document.getElementById('upDatebtn')


const templating =(arr)=>{
    let result ='';
    arr.forEach(ele => {
        result += `
            <div class="card mb-4" id="${ele.id}">
            <div class="card-header">
                <h3>${ele.title}</h3>
            </div>
            <div class="card-body">
                <p>${ele.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDeletBtn(this)">Delete</button>

            </div>
            </div>

        `
    });
    postContainer.innerHTML=result;
}

let baseUrl =`https://fir-api-b7d0b-default-rtdb.asia-southeast1.firebasedatabase.app/`

let postUrl =`${baseUrl}/posts.json`

const makeApicall =(method, apiUrl, body)=>{
    return new Promise((resolve, reject)=>{
        let xhr =new XMLHttpRequest();
        xhr.open(method, apiUrl)
        xhr.onload =function(){
            if( xhr.status >= 200 || xhr.status <= 300){
                resolve(xhr.response)
            }else{
                reject('semothing went wrong')
            }
        }
        xhr.send(JSON.stringify(body))
    })
}

makeApicall('GET', postUrl )
.then(res =>{
    let data = JSON.parse(res)
    let postarray =[]
    for(let k in data){
         let o ={
            ...data[k],
            id :k
         }
         postarray.push(o)
    }
    
    templating(postarray)
})
.catch(cl)

postform.addEventListener('submit', (e)=>{
    e.preventDefault();
    let obj ={
        title : titleControl.value,
        body : contentControl.value.trim(),
    }

makeApicall('POST', postUrl,  obj)
    .then(res =>{
        let postdata = JSON.parse(res)
      let card = document.createElement('div')
      card.className ="card mb-4"
      card.id =postdata.name;
     let result = `
                    <div class="card-header">
                    <h3>${obj.title}</h3>
                    </div>
                    <div class="card-body">
                    <p>${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                    <button class="btn btn-danger"  onclick="onDeletBtn(this)">Delete</button>

                    </div>
     
     `
     card.innerHTML =result;
     postContainer.append(card)
    })
    
    .catch(cl)
    postform.reset()
})

const onEditBtn =(e)=>{
    let ediId = e.closest('.card').id;
    localStorage.setItem("ediId", ediId)
    let editUrl = `${baseUrl}/posts/${ediId}.json`
    makeApicall('GET', editUrl)
    .then(res =>{
       let data = JSON.parse(res)
        titleControl.value = data.title;
        contentControl.value =data.body;
    })
    .catch(cl)
    .finally(()=>{
        upDatebtn.classList.remove('d-none')
        createpost.classList.add('d-none')

    })
}

const OnupDate =()=>{
    let obj ={
        title : titleControl.value,
        body : contentControl.value
    }
 let upadteId =localStorage.getItem('ediId')
 let updatUrl = `${baseUrl}/posts/${upadteId}.json`

 makeApicall('PATCH', updatUrl, obj)
 .then(res=>{
    let js = JSON.parse(res)
    let card = [...document.getElementById(upadteId).children]
    card[0].innerHTML = `<h3>${js.title}</h3>`
    card[1].innerHTML =`<p>${js.body}</p>`
 })
 .catch(cl)
    .finally(()=>{
        postform.reset()
        upDatebtn.classList.add('d-none')
        createpost.classList.remove('d-none')
    })
}

const onDeletBtn =(e)=>{
     let deletId = e.closest('.card').id;
     
     let deletUrl =`${baseUrl}/posts/${deletId}.json`
     makeApicall('DELETE', deletUrl)
     .then(res =>{
         let card =document.getElementById(deletId)
         card.remove()
     })
     .catch(cl)
     .finally(()=>{
        postform.reset()
     })
}

 
upDatebtn.addEventListener('click', OnupDate)