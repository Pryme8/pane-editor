export class Text{
    static FontMain: string = "Arial, Helvetica, sans-serif"
    static Base: number = 18
    static Unit: string = "px"
    static BaseSize: string = `${Text.Base+Text.Unit}`

    static Tiny = {
        fontSize : `${Text.ScaleBaseBy(0.45)}`
    }
    static Small = {
        fontSize : `${Text.ScaleBaseBy(0.865)}`
    }
    static Normal = {
        fontSize : `${Text.BaseSize}`
    }
    static Large = {
        fontSize : `${Text.ScaleBaseBy(1.2)}`
    }
    static Yuge = {
        fontSize : `${Text.ScaleBaseBy(1.6)}`
    }
    static ScaleBaseBy(v:number){
        return (Text.Base * v)+Text.Unit
    }
}