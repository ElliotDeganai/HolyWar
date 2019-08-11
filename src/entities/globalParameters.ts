
class GlobalParameter {

    field: Field;
    id: string = 'fight';
    players: Array<Character>;
    playerTour: Character;
    maxMove: number = 3;
    logger: Logger;
    menuManager: MenuManager;
    isFinished: boolean;
    soundBackground: Sound;
    soundFightBackground: Sound;
    soundPickUpWeapon: Sound;
    soundDefenseMode: Sound;
    soundAttack: Sound;


    static getRandomDimension(dimension: number): number {

        return Math.round(Math.random()*dimension);

    }
}

export default LogicHelper;