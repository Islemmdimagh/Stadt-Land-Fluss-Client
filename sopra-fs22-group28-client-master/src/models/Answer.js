class Answer {
    constructor(data = {}) {
        this.id = null;
        this.playerID = null;
        this.playerToken = null;
        this.letter = null;
        this.answer = null;
        this.category = null;
        this.valid = null;
        this.points = null;
        this.wikipediaLink = null;
        this.categoryVerbose = null;
        Object.assign(this, data);
    }
}
export default Answer;