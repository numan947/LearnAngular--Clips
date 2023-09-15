import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?:QueryList<TabComponent>;

  constructor(){}
  
  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      (tab)=>{return tab.active;}
    );

    if(!activeTabs || activeTabs.length === 0){
      this.selectTab(this.tabs!.first);
    }

  }
  selectTab(first: TabComponent) {
    this.tabs?.forEach(tab=>{tab.active = false;});
    first.active = true;
    return false;
  }
  
}
