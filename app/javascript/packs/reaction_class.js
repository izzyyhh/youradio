import {
  LIKE_REACTION,
  DISLIKE_REACTION,
  FIRE_REACTION,
  HEART_REACTION,
  RESET_REACTION,
  ACTIVE_REACTION,
} from "./constants";

export default class Reaction {
  constructor() {
    this.likeCounter = 0;
    this.dislikeCounter = 0;
    this.heartCounter = 0;
    this.fireCounter = 0;
  }
  reset() {
    this.likeCounter = 0;
    this.dislikeCounter = 0;
    this.heartCounter = 0;
    this.fireCounter = 0;
  }

  increment(type) {
    switch (type) {
      case LIKE_REACTION:
        this.likeCounter++;
        break;
      case DISLIKE_REACTION:
        this.dislikeCounter++;
        break;
      case HEART_REACTION:
        this.heartCounter++;
        break;
      case FIRE_REACTION:
        this.fireCounter++;
        break;
      case RESET_REACTION:
        this.reset();
        break;
    }
  }

  handleReaction(data) {
    this.increment(data.reactionType);
  }
}
