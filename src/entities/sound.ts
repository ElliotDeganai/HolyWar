class Sound {
    soundUrl: string;
    $el: HTMLAudioElement;

    constructor(url: string) {
        this.soundUrl = url;
        this.$el = document.createElement("audio");
        this.$el.src = url;
    }

      play(){
          let backgroundAudio = this.$el;
const playPromise = this.$el.play();
if (playPromise !== null){
    playPromise.catch(() => { backgroundAudio.play(); })
}
      }

        stop(){
        this.$el.pause();
      }



}
export default Sound;