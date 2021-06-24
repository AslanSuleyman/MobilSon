import { Component, Input, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
})
export class SelectMenuComponent implements OnInit {
  @Input('trigger') trigger;
  constructor() { }

  ngOnInit() {
    console.log(this.trigger);
  }

}
