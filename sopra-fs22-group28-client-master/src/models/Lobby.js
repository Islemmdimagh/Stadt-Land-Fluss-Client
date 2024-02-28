class Lobby {
    constructor(data = {}) {
        this.id = null;
        this.host = null;
        this.rounds = null;
        this.hostToken = null;

        this.roundStarted = false;
        this.roundDuration = null;

        this.categoryCitiesActive = false;
        this.categoryCountriesActive = false;
        this.categoryRiversActive = false;
        this.categoryMunicipalityActive = false;

        this.customCategory1 = null;
        this.customCategory2 = null;
        this.customCategory3 = null;
        this.currentLetter = null;
        this.players = null;
        Object.assign(this, data);
    }
}

export default Lobby;