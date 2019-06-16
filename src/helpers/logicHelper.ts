
abstract class LogicHelper {
    static getRandomDimension(dimension: number): number {

        return Math.round(Math.random()*dimension);

    }
}

export default LogicHelper;