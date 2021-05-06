export default class Reaction {
  constructor(like, dislike, heart, fire) {
    this.likeCounter = like;
    this.dislikeCounter = dislike;
    this.heartCounter = heart;
    this.fireCounter = fire;
  }
  reset() {
    this.likeCounter = 0;
    this.dislikeCounter = 0;
    this.heartCounter = 0;
    this.fireCounter = 0;
  }
}
