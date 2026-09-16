const data = [
    ['Агуреевwа', 'Азаренко', 'Арестовwа', 'Азаровwа', 'Аникинwа', 'Бабенко', 'Бахмут', 'Бурик', 'Ветренко', 'Воробьёвwа',
        'Гавриловwа', 'Громовwа', 'Довженко', 'Егоровwа', 'Захаровwа', 'Ивакинwа', 'Каламбет', 'Коваленко', 'Луговmойwая', 'Мороз'],
    ['mАндрей', 'mСергей', 'wЛидия', 'wТатьяна', 'mЮрий', 'mНиколай', 'mМаксим', 'mМихаил', 'mОлег', 'wОльга'],
    ['Витальевич', 'Михайлович', 'Андреевич', 'Сергеевич', 'Юрьевич', 'Николаевич', 'Максимович', 'Олегович', 'Антонович', 'Владимирович']
]
const uniletters = 'КЕНХВАРОСМТ'
const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
    'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
]
const perZP = 12 * 60
let hideCard = null, worldRunning = true, timespeed = 1, curTime = new Date()
curTime.setHours(8, 0, 0, 0)
let nextStatUp = new Date(curTime.getTime()), nextZP = new Date(curTime.getTime() + perZP * 60000)

class Peoples {
    constructor() {
        this.body = clients.newPerson()
        this.cash = 1000
        this.bank = { acc: null, balance: 0 }
        this.evtm = new Date(curTime)
    }

    chgMoney() {
        if (curTime >= nextZP) {
            const curZP = Math.floor(Math.random() * 1000 + 500)
            this.cash += curZP
            console.log('Зарплата:', this.body.fio, curZP)
        }
        if (curTime >= this.evtm) {
            this.evtm.setMinutes(curTime.getMinutes() + Math.floor(Math.random() * 50 + 10))
            const rndMoney = Math.floor(Math.random() * 100 + 1)
            if (Math.random() < 0.7 && this.cash >= rndMoney) {
                this.cash = this.cash - rndMoney
                //console.log(this.body.fio + ' потратил ' + rndMoney)
            } else {
                if (Math.random() < 0.3) {
                    this.cash = this.cash + rndMoney
                    //console.log(this.body.fio + ' надыбал ' + rndMoney)
                }
            }
            if (this.cash > 3000) { console.log(this.body.fio + ' разбогател') }
            if (this.cash < 100) { console.log(this.body.fio + ' хочет кредит') }
            this.cash = this.cash < 0 ? 0 : this.cash
        }
    }
}

class Persones {
    constructor(arrays) {
        this.arrays = arrays
        this.multipliers = []
        let m = 1
        for (let i = arrays.length - 1; i >= 0; i--) {
            this.multipliers[i] = m
            m *= arrays[i].length
        }
        this.total = m
        this.available = Array.from({ length: this.total }, (_, i) => i)
        console.log('Всего людей:', this.total)
    }

    newPerson() {
        if (this.available.length === 0) return null
        const randPoolIdx = Math.floor(Math.random() * this.available.length)
        const comboIdx = this.available[randPoolIdx]
        this.available[randPoolIdx] = this.available[this.available.length - 1]
        this.available.pop()
        let result = []
        let remainder = comboIdx
        for (let i = 0; i < this.arrays.length; i++) {
            const arrIdx = Math.floor(remainder / this.multipliers[i])
            result.push(this.arrays[i][arrIdx])
            remainder %= this.multipliers[i]
        }
        const sex = result[1][0]
        result[1] = result[1].replace(sex, '')
        if (sex === 'm') {
            result[0] = result[0].replace(/w.*/, '').replace(/m/, '')
        } else {
            result[0] = result[0].replace(/m[^w]*/, '').replace(/w/, '')
            result[2] = result[2].replace(/ич$/, 'на')
        }
        const numpass = comboIdx.toString().padStart(6, '0')
        const firstIndex = Math.floor(Math.random() * uniletters.length)
        let secondIndex
        do {
            secondIndex = Math.floor(Math.random() * uniletters.length)
        } while (secondIndex === firstIndex)
        const prefix = uniletters[firstIndex] + uniletters[secondIndex]
        return { genre: sex, pass: comboIdx, numpass: `${prefix} ${numpass}`, fio: result.join(' ') }
    }
}

//=========================================================================================================================
const allpeople = [], maxClients = 10
const clients = new Persones(data)

document.getElementById('startBtn').classList.toggle('active')
updateClock()
for (let i = 0; i < maxClients; i++) {
    const newpers = new Peoples()
    allpeople.push(newpers)
}
allpeople.sort((a, b) => a.body.fio.localeCompare(b.body.fio, 'ru'))
//allpeople[0].bank.acc = genNumAcc(allpeople[0].body.pass, 12)
//allpeople[0].bank.balance = 100000000

const peopleList = document.getElementById('peopleList')
const personCard = document.getElementById('personCard')
createPeopleList()

const worldtime = setInterval(() => { worldtick() }, 1000)

const pauseBtn = document.getElementById('pauseBtn')
const startBtn = document.getElementById('startBtn')
const addTimeBtn = document.getElementById('addTimeBtn')
pauseBtn.onclick = () => {
    pauseBtn.classList.toggle('active')
    startBtn.classList.remove('active')
    addTimeBtn.classList.remove('active')
    worldRunning = false
}

startBtn.onclick = () => {
    pauseBtn.classList.remove('active')
    startBtn.classList.toggle('active')
    addTimeBtn.classList.remove('active')
    timespeed = 1
    worldRunning = true
}

addTimeBtn.onclick = () => {
    pauseBtn.classList.remove('active')
    startBtn.classList.remove('active')
    addTimeBtn.classList.toggle('active')
    timespeed = 10
    worldRunning = true
}

function genNumAcc(x, N = 6) {
    const M = 10n ** BigInt(N)
    const A = 742938281n
    const B = 1234567n
    const pseudoInt = (BigInt(x) * A + B) % M
    return pseudoInt.toString().padStart(N, '0').match(/.{1,4}/g).join(' ')
}

function createPeopleList() {
    peopleList.innerHTML = ''
    allpeople.forEach(person => {
        const button = document.createElement('button')
        button.className = 'person-button'
        button.textContent = person.body.fio
        button.onclick = () => {
            showPerson(person)
        }
        peopleList.appendChild(button)
    })
}

function showPerson(data) {
    if (hideCard) { clearTimeout(hideCard) }
    const buttons = document.querySelectorAll('.person-button')
    buttons.forEach(b => b.innerText === data.body.fio ? b.classList.toggle('active') : b.classList.remove('active'))
    document.getElementById('personGenre').textContent = data.body.genre === 'm' ? '👨🏻' : '👩🏻'
    document.getElementById('personPass').textContent = `${data.body.numpass}`
    const fio = data.body.fio.trim().split(/\s+/)
    document.getElementById('personFio').innerHTML = `<span class='fio-first'>${fio[0]}</span><span class='fio-rest'>${fio.slice(1).join(' ')}</span>`
    document.getElementById('personCash').textContent = '💵 ' + data.cash.toLocaleString('ru-RU') + ' ₴'
    const bankInfo = document.getElementById('bankInfo')
    if (data.bank && data.bank.acc !== null) {
        bankInfo.style.display = 'block'
        document.getElementById('personAccount').textContent = data.bank.acc
        document.getElementById('personBalance').textContent = '🏦 ' + data.bank.balance.toLocaleString('ru-RU') + ' ₴'
    } else {
        bankInfo.style.display = 'none'
    }
    personCard.classList.remove('hidden')
    hideCard = setTimeout(() => {
        personCard.classList.toggle('hidden')
        buttons.forEach(b => b.classList.remove('active'))
    }, 60000)
}

function worldtick() {
    if (!worldRunning) return
    curTime.setMinutes(curTime.getMinutes() + timespeed)
    updateClock()
    allpeople.forEach(person => { person.chgMoney() })
    if (curTime >= nextZP) {
        nextZP.setMinutes(nextZP.getMinutes() + perZP)
        console.log('--=====--')
    }
    if (curTime >= nextStatUp) {
        getMostRich(3)
        nextStatUp.setMinutes(nextStatUp.getMinutes() + 15)
    }
}

function updateClock() {
    const hours = String(curTime.getHours()).padStart(2, '0')
    const minutes = String(curTime.getMinutes()).padStart(2, '0')
    document.getElementById('clock').textContent = `${hours}:${minutes}`
    document.getElementById('date').textContent = `${curTime.getDate()} ${months[curTime.getMonth()]} ${curTime.getFullYear()}`
}

function getMostRich(Kolvo = 1) {
    const best = allpeople.sort((a, b) => b.cash - a.cash).slice(0, Kolvo)
    const list = best.map(person => {
        const [lastName, firstName, middleName] = person.body.fio.trim().split(/\s+/)
        const formattedFio = `${lastName} ${firstName[0] + '.'}${middleName[0] + '.'}`
        return {
            fio: formattedFio,
            cash: person.cash
        }
    })
    document.getElementById('listRich').innerHTML = list.map((pers, idx) => { return `${idx + 1}. ${pers.fio} - ${pers.cash} ₴` }).join('<br>')
}
