export class Padding{
    static Base: number = 1
    static Unit: string = "em"
    static Tiny: any = {
        paddingLeft : `${Padding.ScaleBaseBy(0.1)}`,
        paddingRight : `${Padding.ScaleBaseBy(0.1)}`,
        paddingTop : `${Padding.ScaleBaseBy(0.2)}`,
        paddingBottom : `${Padding.ScaleBaseBy(0.2)}`
    }
    static Small: any = {
        paddingLeft : `${Padding.ScaleBaseBy(0.2)}`,
        paddingRight : `${Padding.ScaleBaseBy(0.2)}`,
        paddingTop : `${Padding.ScaleBaseBy(0.4)}`,
        paddingBottom : `${Padding.ScaleBaseBy(0.4)}`
    }
    static Normal: any = {
        paddingLeft : `${Padding.ScaleBaseBy(0.8)}`,
        paddingRight : `${Padding.ScaleBaseBy(0.8)}`,
        paddingTop : `${Padding.ScaleBaseBy(0.65)}`,
        paddingBottom : `${Padding.ScaleBaseBy(0.65)}`
    }
    static Large: any = {
        paddingLeft : `${Padding.ScaleBaseBy(1.2)}`,
        paddingRight : `${Padding.ScaleBaseBy(1.2)}`,
        paddingTop : `${Padding.ScaleBaseBy(1.0)}`,
        paddingBottom : `${Padding.ScaleBaseBy(1.0)}`
    }
    static ScaleBaseBy(v:number){
        return (Padding.Base * v)+Padding.Unit
    }
}