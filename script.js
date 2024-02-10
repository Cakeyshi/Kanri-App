//schedule module

class Schedule{

    constructor(sched){
        this.sched = sched
        this.currDay = new Date()
    }

    show(){
        const today = this.currDay.getDay()
        const schedToday = this.sched

        switch(today){
            case 1:
                return schedToday.monday
            case 2:
                return schedToday.tuesday
            case 3:
                return schedToday.wednesday
            case 4: 
                return schedToday.thursday
            case 5: 
                return schedToday.friday
            case 6:
                return schedToday.saturday
            default:
                return false
        }
    }
    //returns the current day, to be used
    //in deletion of local file
    // in the SchedObj Class
    showDay(){
        const today = this.currDay.getDay()

        switch(today){
            case 1:
                return "monday"
            case 2:
                return "tuesday"
            case 3:
                return "wednesday"
            case 4: 
                return "thursday"
            case 5: 
                return "friday"
            case 6:
                return "saturday"
            default:
                return false
        }
    }
   

    
}

class SchedObj{
    constructor(){
        this.sched = {
            'monday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
            'tuesday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
            'wednesday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
            'thursday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
            'friday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
            'saturday': { 'subject': [], 'time': [], 'edp': [], 'roomNumber': [] },
        };

        if(localStorage.getItem('scheduleData')){
            this.sched = JSON.parse(localStorage.getItem('scheduleData'));
        }
    }


    saveToLocalStorage(){
        localStorage.setItem('scheduleData', JSON.stringify(this.sched));
        console.log("Successfully saved to file!");
    }

    getTimeInMinutes(timeString) {
        const [hours, minutes] = timeString.split(' - ')[0].split(':').map(Number);
        return hours * 60 + minutes;
    }

    sortSched(){
        for (const key in this.sched) {
            // Create an array of objects with keys and values
            const sorted = this.sched[key].time.map((time, index) => ({ index, time }));
        
            // Sort the array of objects based on the time
            sorted.sort((a, b) => {
                const timeA = this.getTimeInMinutes(a.time);
                const timeB = this.getTimeInMinutes(b.time);
                return timeA - timeB;
            });
        
            // Update the original object with the sorted values
            this.sched[key].time = sorted.map(item => item.time);
        }

    }

    addNewSched(day, subject, time, edp, roomNumber){
        this.sched[day]['subject'].push(subject)
        this.sched[day]['time'].push(time)

        //optional
        this.sched[day]['edp'].push(edp)
        this.sched[day]['roomNumber'].push(roomNumber)

        this.sortSched();
        this.saveToLocalStorage();
        
    }

    addMultipleSched(days, subject, time, edp, roomNumber){
        days.forEach(day => {
            this.sched[day]['subject'].push(subject);
            this.sched[day]['time'].push(time);
            this.sched[day]['edp'].push(edp);
            this.sched[day]['roomNumber'].push(roomNumber);
        });

        // Save the updated schedule data to local storage
        this.sortSched()
        this.saveToLocalStorage();
    }

    deleteSched(day, value){
        const index = this.sched[day]['subject'].indexOf(value)

        if(index != -1){
            this.sched[day]['subject'].splice(index, 1)
            this.sched[day]['time'].splice(index, 1)
            this.sched[day]['edp'].splice(index, 1)
            this.sched[day]['roomNumber'].splice(index, 1)
        }

        this.sortSched();
        this.saveToLocalStorage();
        console.log(this.sched);
        console.log("successfully delete from local storage");
    }

    showMerged() {
        const merged = {
            subject: [],
            time: [],
            edp: [],
            roomNumber: [],
            day: []
        };
    
        // Iterate over each day in the schedule
        for (const day in this.sched) {
            const daySchedule = this.sched[day];
    
            // Iterate over each key in the day's schedule
    
                for (let i = 0; i < daySchedule.subject.length; i++) {
                    // Push the corresponding data for each day into the merged object
                    merged.subject.push(daySchedule.subject[i]);
                    merged.time.push(daySchedule.time[i]);
                    merged.edp.push(daySchedule.edp[i]);
                    merged.roomNumber.push(daySchedule.roomNumber[i]);
                    merged.day.push(day);
                }
            }
        return merged;
    }
}




const schedObj = new SchedObj()
const mySched = new Schedule(schedObj.sched)


//output what day is today
const dayHeader = () => {
    const day = document.getElementById('dayHeader')
    const dayToday = mySched.showDay();
    const upperLetter = dayToday.charAt(0).toUpperCase();

    const newDay = dayToday.split("")
    newDay.shift()
    newDay.unshift(upperLetter)
    const newarr = newDay.join('');

    day.textContent = `My Schedule - ${newarr}`;

}
//render merged sched
const updateMerge = (obj) =>{
    const elementCount = Object.values(obj)[0].length;
    const tbody = document.getElementById('tbody');


    for (let i = 0; i < elementCount; i++) {
        const newRow = tbody.insertRow();
        newRow.id = i

        Object.keys(obj).forEach(key => {
            const value = obj[key][i];
            const newCell = newRow.insertCell();

            newCell.textContent = value;
        })

    //render delete button
    let td = document.createElement('td')
    let delBtn = document.createElement('button')
    delBtn.type = 'button'
    delBtn.id = 'deleteBtn'
    delBtn.className = 'btn btn-outline-info'
    td.appendChild(delBtn)

    
    //render delete svg icon
    let dltIcon = document.createElement('img')
    dltIcon.src = '../svg_icons/trash-can-solid.svg'
    dltIcon.style = 'width: 20px; height: 20px;'
    delBtn.appendChild(dltIcon)

    newRow.appendChild(td)
    console.log('delete button added')
     

    //functionality to the delete Button
    delBtn.addEventListener('click', () => {

        const row = document.getElementById(i)
        const cells = row.getElementsByTagName('td')
        const firstTd = cells[0]
        const value = firstTd.textContent
        const lastTd = cells[cells.length - 2]
        const dayValue = lastTd.textContent
        deleteRow(i)

        //delete obj record
        schedObj.deleteSched(dayValue, value)
        console.log(mySched.show())
        console.log(mySched.showDay())
        console.log(dayValue);
        console.log('row index: ' + i + 'is deleted')
        })

    }
}

//delete row function
const deleteRow = (index) => {
    const rowToRemove = document.getElementById(index)
    if(rowToRemove){
        rowToRemove.remove()
        console.log('remove is working')
    }
}
//render current sched
const updateSchedule = (sched, obj) => {
    const tbody = document.getElementById('tbody');
    const imgDiv = document.getElementById('noclassimg');
    tbody.innerHTML = '';
   

    if (!sched || typeof sched !== 'object') {
        const noClassImg = document.createElement('img');
        const noClassText = document.createElement('p');
        noClassImg.src = '../images/b7dadf57f03072b5406bdd5836bfa20f.jpg';
        noClassImg.style = `padding: 20px;
                            margin: auto; 
                            positiion: relative; 
                            display: flex; 
                            justify-content: 
                            center; 
                            align-items: center;`
        
        noClassText.textContent = 'No Class today!'
        noClassText.style = `padding: 2px; 
                             margin: auto; 
                             font-weight: bold;
                              font-size: 20px; 
                              positiion: relative; 
                              display: flex; 
                              justify-content: 
                              center; 
                              align-items: center;`
        imgDiv.appendChild(noClassImg);
        imgDiv.appendChild(noClassText)
        return;  
    }else{
        const elementCount = Object.values(sched)[0].length;


        for (let i = 0; i < elementCount; i++) {
            const newRow = tbody.insertRow();
            newRow.id = i

            Object.keys(sched).forEach(key => {
                const value = sched[key][i];
                const newCell = newRow.insertCell();
                newCell.textContent = value;
            })


        //secret day indicator
        let dayTd = document.createElement('td')
        dayTd.style = 'display: none;'
        const dayObj = obj.sched
        switch(sched){
            case dayObj['monday']:
                dayTd.value = 'monday'
                break
            case dayObj['tuesday']:
                dayTd.value = 'tuesday'
                break
            case dayObj['wednesday']:
                dayTd.value = 'wednesday'
                break
            case dayObj['thursday']:
                dayTd.value = 'thursday'
                break
            case dayObj['friday']:
                dayTd.value = 'friday'
                break
            case dayObj['saturday']:
                dayTd.value = 'saturday'
                break
        }

        //render delete button
        let td = document.createElement('td')
        let delBtn = document.createElement('button')
        delBtn.type = 'button'
        delBtn.id = 'deleteBtn'
        delBtn.className = 'btn btn-outline-info'
        td.appendChild(delBtn)

        
        //render delete svg icon
        let dltIcon = document.createElement('img')
        dltIcon.src = '../svg_icons/trash-can-solid.svg'
        dltIcon.style = 'width: 20px; height: 30px;'
        delBtn.appendChild(dltIcon)

        newRow.appendChild(td)
        newRow.appendChild(dayTd)
        console.log(dayTd.value)
        console.log('delete button added')
         

        //functionality to the delete Button
        delBtn.addEventListener('click', () => {

            const row = document.getElementById(i)
            const cells = row.getElementsByTagName('td')
            const firstTd = cells[0]
            const value = firstTd.textContent
            deleteRow(i)

            //delete obj record
            schedObj.deleteSched(mySched.showDay(), value)
            console.log(mySched.show())
            console.log(value);
            console.log('row index: ' + i + 'is deleted')
            })

        }
        
    }

    console.log('rendering schedule is working')
}

//adding single schedule 
const addBtn = document.getElementById('addBtn')
const add = document.getElementById('add');

//add screen pop
addBtn.addEventListener('click', () => {
    const addSched = document.getElementById('addSched')
    const container = document.getElementById('container')

    let subject = document.getElementById('subject')
    let time1 = document.getElementById('time1')
    let time2 = document.getElementById('time2')
    let day = document.getElementById('day')
    let edp = document.getElementById('edp')
    let roomNum = document.getElementById('roomNum')

    //clear input 

    subject.value = ''
    time1.value = ''
    time2.value = ''
    day.value = 'monday'
    edp.value = ''
    roomNum.value = ''
    add.disabled = true

    container.style.display = 'none'
    addSched.style.display = 'block'

    console.log("Add btn is pressed")
    console.log(day.value);
})

//add new sched
add.addEventListener('click', () => {
    const addSched = document.getElementById('addSched')
    const container = document.getElementById('container')

    let subject = document.getElementById('subject').value
    let time1 = document.getElementById('time1').value
    let time2 = document.getElementById('time2').value
    let day = document.getElementById('day').value
    let edp = document.getElementById('edp').value
    let roomNum = document.getElementById('roomNum').value

     const time = `${time1} - ${time2}`
   

    try{
    schedObj.addNewSched(day, subject, time, edp, roomNum)
        console.log(day)
    document.getElementById('popup').style.display = 'block'
    setTimeout(() => document.getElementById('popup').style = 'display: none;', 3000)

    console.log("pop up works!")
    
    updateSchedule(mySched.show(), schedObj)
    }catch(err){
        document.getElementById('popupError').style.display = 'block'
        document.getElementById('popupError').textContent = `Error: ${err}`
    }
    container.style.display = 'block'
    addSched.style.display = 'none'

    console.log("add button is working")

    console.log(mySched.show())

})

//time logic
const checkTime = (time) => {
    return time.value.trim() !== '';
}

let subject = document.getElementById('subject');
let time1 = document.getElementById('time1');
let time2 = document.getElementById('time2');

subject.addEventListener('input', () => {
    const subjectValue = subject.value;

    if (subjectValue.trim() !== '' && checkTime(time1) && checkTime(time2)) {
        add.disabled = false;
    } else {
        add.disabled = true;
    }
});


time1.addEventListener('input', () => {
    if (subject.value.trim() !== '' && checkTime(time1) && checkTime(time2)) {
        add.disabled = false;
    } else {
        add.disabled = true;
    }
});

time2.addEventListener('input', () => {
    if (subject.value.trim() !== '' && checkTime(time1) && checkTime(time2)) {
        add.disabled = false;
    } else {
        add.disabled = true;
    }
});


//cancel adding sched
const cancel = document.getElementById('cancel')

cancel.addEventListener('click', () => {
    const addSched = document.getElementById('addSched')
    const container = document.getElementById('container')

    container.style.display = 'block'
    addSched.style.display = 'none'

    console.log('Cancel is working')
})

//adding multiple schedules
const addMultpleBtn = document.getElementById('addMultipleBtn')
const addMultiple = document.getElementById('multi_add')

addMultpleBtn.addEventListener('click', () => {
    const addSched = document.getElementById('addMultipleSched')
    const container = document.getElementById('container')

    let subject = document.getElementById('multiSubject')
    let time1 = document.getElementById('multi_time1')
    let time2 = document.getElementById('multi_time2')
    let day = document.getElementById('multi_day')
    let edp = document.getElementById('multi_edp')
    let roomNum = document.getElementById('multi_roomNum')


    //clear input 

    subject.value = ''
    time1.value = ''
    time2.value = ''
    edp.value = ''
    roomNum.value = ''
    add.disabled = true

    container.style.display = 'none'
    addSched.style.display = 'block'

    console.log("Add btn is pressed")
})

addMultiple.addEventListener('click', () => {
    const addSched = document.getElementById('addMultipleSched')
    const container = document.getElementById('container')

    let subject = document.getElementById('multiSubject').value
    let time1 = document.getElementById('multi_time1').value
    let time2 = document.getElementById('multi_time2').value
    let day = document.getElementById('multipleDay')
    let dayArray = Array.from(day.selectedOptions).map(option => option.value);
    let edp = document.getElementById('multi_edp').value
    let roomNum = document.getElementById('multi_roomNum').value

    const time = `${time1} - ${time2}`
   

    try{
    schedObj.addMultipleSched(dayArray, subject, time, edp, roomNum)
        console.log(dayArray)
    document.getElementById('popup').style.display = 'block'
    setTimeout(() => document.getElementById('popup').style = 'display: none;', 3000)

    console.log("pop up works!")
    
    updateSchedule(mySched.show(), schedObj)
    }catch(err){
        document.getElementById('popupError').style.display = 'block'
        document.getElementById('popupError').textContent = `Error: ${err}`
    }
    container.style.display = 'block'
    addSched.style.display = 'none'

    console.log("add button is working")

    console.log(mySched.show())

})

let multi_subject = document.getElementById('multiSubject');
let multi_time1 = document.getElementById('multi_time1');
let multi_time2 = document.getElementById('multi_time2');

multi_subject.addEventListener('input', () => {
    const subjectValue = multi_subject.value;

    if (subjectValue.trim() !== '' && checkTime(multi_time1) && checkTime(multi_time2)) {
        add.disabled = false;
    } else {
        add.disabled = true;
    }
});


multi_time1.addEventListener('input', () => {
    if (subject.value.trim() !== '' && checkTime(time1) && checkTime(time2)) {
        addMultiple.disabled = false;
    } else {
        addMultiple.disabled = true;
    }
});

multi_time2.addEventListener('input', () => {
    if (multi_subject.value.trim() !== '' && checkTime(multi_time1) && checkTime(multi_time2)) {
        addMultiple.disabled = false;
    } else {
        addMultiple.disabled = true;
    }
});


//cancel adding sched
const multi_cancel = document.getElementById('multi_cancel')

multi_cancel.addEventListener('click', () => {
    const addSched = document.getElementById('addMultipleSched')
    const container = document.getElementById('container')

    container.style.display = 'block'
    addSched.style.display = 'none'

    console.log('Cancel is working')
})


//show all and hide event
const disabledEye = document.getElementById('eye_button_disable')
const enabledEye = document.getElementById('eye_button_enable')

disabledEye.addEventListener('click', () => {
    disabledEye.style.display = "none";
    enabledEye.style.display = "block";
    document.getElementById('dayHeader').textContent = "My Schedule - All"
     //unhide day collumn
    document.getElementById('dayCol').style.display = 'block'
    //clear initial contents
    const tbody = document.getElementById('tbody')
    const row = tbody.querySelectorAll('tr')

    row.forEach((tr) => {
        tr.remove();
    })
    updateMerge(schedObj.showMerged())
    console.log(schedObj.showMerged())

})

enabledEye.addEventListener('click', () => {
    disabledEye.style.display = "block";
    enabledEye.style.display = "none";

    //hide day collumn
    document.getElementById('dayCol').style.display = 'none'

    dayHeader();
    updateSchedule(mySched.show(), schedObj)
})


//this will output what day is today in the header
dayHeader();



//making sure that everything is rendered
updateSchedule(mySched.show(), schedObj)
console.log(schedObj.showMerged())
console.log(mySched.show())
