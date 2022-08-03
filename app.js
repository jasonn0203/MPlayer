//#region //NOTE get elements
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const songPlaylist = $(".playlist");
const headerDisplay = $(".header__current");
const repeat = $(".btn-repeat");
const backward = $(".btn-backward");
const forward = $(".btn-forward");
const togglePlay = $(".btn-toggle-play");
const shuffle = $(".btn-shuffle");
const audio = $("#audio");
const button = $$(".btn");
const progressBar = $("#progress-bar");
const playlistItem = $(".playlist-item");
const playlistItemActive = $(".playlist-item.active");

//#endregion
// ----------------------------------------------------------------------------------------------------------------------------------

const app = {
  //States
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,

  songs: [
    {
      name: "Chay khoi the gioi nay",
      author: "Da Lab, Phuong Ly",
      url: "./assets/musics/ChayKhoiTheGioiNay-DaLABPhuongLy-7574104.mp3",
      image: "./images/dalab-ply.jpg",
      id: 1,
    },
    {
      name: "Pillowtalk",
      author: "Zayn",
      url: "./assets/musics/Pillowtalk - Zayn.mp3",
      image: "./images/pillowtalk.jpg",
      id: 2,
    },
    {
      name: "Vai cau noi co khien nguoi thay doi",
      author: "Grey D",
      url: "./assets/musics/Vaicaunoicokhiennguoithaydoi-GREYDDoanTheLan-7576195.mp3",
      image: "./images/greyd.jpg",
      id: 3,
    },
    {
      name: "Vi me anh bat chia tay",
      author: "Miu Le, Karik",
      url: "./assets/musics/ViMeAnhBatChiaTay-MiuLe-7503053.mp3",
      image: "./images/miule.jpg",
      id: 1,
    },
    {
      name: "Nguoi thuong",
      author: "Hoang Ton",
      url: "./assets/musics/Nguoi Thuong - Hoang Ton.mp3",
      image: "./images/hoang-ton.jpg",
      id: 5,
    },
    {
      name: "See Tinh",
      author: "Hoang Thuy Linh",
      url: "./assets/musics/Hoàng Thuỳ Linh - See Tình _ Official Music Video.mp3",
      image:
        "https://danviet.mediacdn.vn/296231569849192448/2022/2/22/edit-sbt3514-16455475804481212446471.jpeg",
      id: 6,
    },
    {
      name: "Chim Sau",
      author: "MCK",
      url: "./assets/musics/Chìm Sâu - RPT MCK (feat. Trung Trần) _ Official Lyrics Video.mp3",
      image: "https://2sao.vietnamnetjsc.vn/images/2022/01/24/09/34/mckbia.png",
      id: 7,
    },
  ],

  //NOTE Define Props
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      //Get current song
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  //NOTE Render playlist
  renderSong: function (songs) {
    let htmlInner = this.songs.map((song, index) => {
      return `
          <div class="playlist-item ${
            index === this.currentIndex ? "active" : ""
          }" song-index=${index}>
              <div class="playlist-thumb">
                  <img src="${song.image}">
              </div>
              <div class="playlist-info">
                  <h3 class="playlist-title">${song.name}</h3>
                  <h4 class="playlist-author">${song.author}</h4>
              </div>
          </div>
      `;
    });
    songPlaylist.innerHTML = htmlInner.join("");
  },

  //NOTE Handle Events
  handleEvent: function () {
    //NOTE Rotate thumb image
    const headerThumbRotate = $(".thumb").animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 20000, // 10 seconds
        iterations: Infinity,
      }
    );
    headerThumbRotate.pause();

    //FIXME resize thumb image when scrolling
    // window.onscroll = function () {
    //   // const headerThumb = $(".thumb");
    //   const scrollTop = window.scrollY || document.documentElement.scrollTop;
    //   const newHeaderThumb = $(".thumb") - scrollTop;
    //   console.log(window.scrollY);
    //   $(".thumb").style.width = newHeaderThumb > 0 ? newHeaderThumb + "px" : 0;
    //   $(".thumb").style.opacity = newHeaderThumb / $(".thumb");
    // };

    //Toggle play/pause button
    togglePlay.onclick = () => {
      //Default value off isPlaying is FALSE
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Logic for pause and play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      headerThumbRotate.play(); //toggle thumb rotate
    };
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      headerThumbRotate.pause(); //pause thumb rotate
    };

    //Update progress bar time
    audio.ontimeupdate = function () {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    };
    //Seek on progress bar
    progressBar.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Next song
    forward.onclick = function () {
      if (app.isShuffle) {
        app.shuffleSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.renderSong();
      app.scrollToActiveSong();
    };
    //Previous song
    backward.onclick = function () {
      if (app.isShuffle) {
        app.shuffleSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.renderSong();
      app.scrollToActiveSong();
    };
    //NOTE shuffle song
    shuffle.onclick = function () {
      app.isShuffle = !app.isShuffle;
      shuffle.classList.toggle("active", app.isShuffle);
    };
    //NOTE Repeat song
    repeat.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeat.classList.toggle("active", app.isRepeat);
    };
    //NOTE on end Song
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        forward.onclick();
      }
    };
    songPlaylist.onclick = function (e) {
      //Detect area when click
      const songArea = e.target.closest(".playlist-item:not(.active)");
      //Handle when onclick in the playlist to play song
      if (songArea) {
        app.currentIndex = Number(songArea.getAttribute("song-index")); //Convert to number
        app.updateSongInfo();
        app.renderSong();
        audio.play();
      }
    };
  },

  // -----------------------------
  //NOTE display info of current song when load
  updateSongInfo: function () {
    //Update song name in header
    headerDisplay.innerHTML = this.currentSong.name;
    //Update audio source
    audio.setAttribute("src", this.currentSong.url);
    //Update thumb image
    $(
      ".thumb__image"
    ).style.backgroundImage = `url('${this.currentSong.image}')`;
  },
  //NOTE Next song
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0; //Assign to the first song of the list
    }
    this.updateSongInfo();
  },
  //NOTE previous song
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.updateSongInfo();
  },
  //NOTE Shuffe song
  shuffleSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length); //Random song in the list
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.updateSongInfo();
  },
  repeatSong: function () {
    if (isRepeat) {
    }
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".playlist-item.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 300);
  },

  //NOTE Run
  load: function () {
    this.defineProperties();
    this.handleEvent();
    this.updateSongInfo();
    this.renderSong();
  },
};

app.load();
