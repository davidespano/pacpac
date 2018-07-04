class Transition{

    constructor(media = "", target = "", duration = 0, rotation = '0 0 0', theta = 10, height = 2){

        this.media = media;
        this.target = target;
        this.duration = duration;
        this.rotation = rotation; // format stringa con tre numeri separati da uno spazio, mettere tre campi diversi
        this.theta = theta;
        this.height = height;

    };

}

export default Transition;