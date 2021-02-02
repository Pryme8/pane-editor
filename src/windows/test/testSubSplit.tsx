import { IModalProps, IModalState, Modal } from "../../components/modal/modal"
import {SplitPanelVertical, SplitPanelTop, SplitPanelBottom, SplitPanelHorizontal, SplitPanelLeft, SplitPanelRight} from '../../components/panel'
import {TabPanel, PanelSection} from '../../components/panel'
import { Padding } from "../../constants"


export interface ITestSubSplitProps extends IModalProps{}
export interface ITestSubSplitState extends IModalState{}

export class TestSubSplit<T extends IModalProps, S extends IModalState> extends Modal<T, S>{
    
    public onInit = ()=>{
             
    }  

    componentDidUpdate(){
        //this.bjsEngine.resize()
    }

    public content(){
        return (
            <SplitPanelVertical>
                <SplitPanelTop>
                    <SplitPanelVertical>
                        <SplitPanelTop><div style={{...Padding.Large}}>Sub Top</div></SplitPanelTop >
                        <SplitPanelBottom><div style={{...Padding.Large}}>Sub Bottom</div></SplitPanelBottom>
                    </SplitPanelVertical>
                </SplitPanelTop >
                <SplitPanelBottom>
                    <SplitPanelHorizontal>
                        <SplitPanelLeft><div style={{...Padding.Large}}>Sub Left</div></SplitPanelLeft >
                        <SplitPanelRight><div style={{...Padding.Large}}>Sub Right</div>                        
                        <TabPanel>
                            <PanelSection title='Base Mesh' style={{...Padding.Normal, minHeight:'100%'}}>
                                <div>
                                Base Height: <br />
                                Base Width: <br />         
                                Base SubDivsXY: <br /> 
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                <br />        
                                </div>
                            </PanelSection>
                            <PanelSection title='Gradient' style={{...Padding.Normal, minHeight:'100%'}}>
                                <div>Panel Content 1</div>
                            </PanelSection>
                            <PanelSection title='LOD' style={{...Padding.Normal, minHeight:'100%'}}>
                                <div>Panel Content 2</div>
                            </PanelSection>
                            </TabPanel>
                        
                        </SplitPanelRight>
                    </SplitPanelHorizontal>
                </SplitPanelBottom>
            </SplitPanelVertical>
        )
    }
}




  
