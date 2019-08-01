class Sound {
    soundUrl: string;
    $el: HTMLAudioElement;

    constructor(url: string) {
        this.soundUrl = url;
        this.$el = document.createElement("audio");
        this.$el.src = url;
        this.$el.volume = 0.2;
    }

      play(){
          let backgroundAudio = this.$el;
 var media = document.getElementById("YourVideo");
const playPromise = backgroundAudio.play();
if (playPromise !== null){
    playPromise.catch(() => { backgroundAudio.play(); })
}
      }

      playContinuously(){
        let _this = this;
        setInterval(_this.play,60000);
      }

        stop(){
        this.$el.pause();
      }



}
export default Sound;