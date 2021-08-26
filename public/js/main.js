/*
    3. play / pause / seek
    4. next / prev song
    5. random song 
    6. repeat song 
    7. song active 
    8. click and play song 
    9. scroll to song active
*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
//
const btn = $('.btn-toggle-play')
const playlist = $('.playlist')
const player = $('.player')
const cd = $('.cd')
const songName = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
//
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Move Your Body",
            singer: "Sia",
            path: "public/music/song1.mp3",
            image: "public/image/img1.jpg"
        },
        {
            name: "Unstoppable",
            singer: "Sia",
            path: "public/music/song2.mp3",
            image: "public/image/img2.jpg"
        },
        {
            name: "Mask off",
            singer: "Future",
            path: "public/music/song3.mp3",
            image: "public/image/img3.jpg"
        },
        {
            name: "My head & my Heart",
            singer: "Ava Max",
            path: "public/music/song4.mp3",
            image: "public/image/img4.jpg"
        },
        {
            name: "Animals",
            singer: "Maroon 5",
            path: "public/music/song5.mp3",
            image: "public/image/img5.jpg"
        },
        {
            name: "They Said",
            singer: "Binz",
            path: "public/music/song6.mp3",
            image: "public/image/img6.jpg"
        },
        {
            name: "Wake me up",
            singer: "Avicci",
            path: "public/music/song7.mp3",
            image: "public/image/img7.jpg"
        },
        {
            name: "Waiting for love",
            singer: "Avicci",
            path: "public/music/song8.mp3",
            image: "public/image/img8.jpg"
        },
        {
            name: "Darkside",
            singer: "Alan Walker",
            path: "public/music/song9.mp3",
            image: "public/image/img9.jpg"
        },
        {
            name: "Alone PT2",
            singer: "Ava Max",
            path: "public/music/song10.mp3",
            image: "public/image/img10.jpg"
        },
    ],
    //định nghĩa thuộc tính
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    //load current song 
    loadCurrentSong: function() {
        songName.textContent = this.currentSong.name
        cdThumb.style.background = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    //scroll to active song 
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        //spin avatar when playing song
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],{
            duration: 10000,
            iterations: Infinity
        })   
        cdThumbAnimate.pause() 
        //minimize avatar when scroll up / down
        document.onscroll = function() {
            let newCdWidth = cdWidth - window.scrollY
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')       
            cdThumbAnimate.play()    
        }
        //khi song pause 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()    
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const currentPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = currentPercent
        }
        //khi tua bài hát
        progress.onchange = function() {
            const seekTime = audio.duration / 100 * progress.value
            audio.currentTime = seekTime
        }
        //click nút next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()               
            }
            audio.play()
            _this.fetchSongs()
            _this.scrollToActiveSong()
        }
        //click nút prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.preSong()               
            }
            audio.play()
            _this.fetchSongs()
            _this.scrollToActiveSong()
        }
        //click nút random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        //click nút repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //khi hết bài
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.onclick()
            }           
        }
        //click chọn bài 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                //xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.fetchSongs()
                    audio.play()        
                }
            }
        }
    },
    //next song
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //pre song
    preSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    //random song 
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    fetchSongs: function() {
      let html = this.songs.map((song, index) => {
        return `<div class="song ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>`
      })  
      playlist.innerHTML = html.join('')
    },
    start: function() {
        //định nghĩa thuộc tính cho object app
        this.defineProperties()
        //xử lý các sự kiện DOM 
        this.handleEvents()
        //tải bài hát đầu tiên vào UI khi start
        this.loadCurrentSong()
        //tải danh sách bài hát 
        this.fetchSongs()      
    }
}
app.start();
