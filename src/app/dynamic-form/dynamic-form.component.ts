import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  jsonObject: any;
  show: boolean = false;
  form: FormGroup = new FormGroup({});
  allInputs: any[];
  allData: any[];
  dropDownOptions: any = []
  convertedDate: any;
  showJsonError: boolean = false
  dropdownItems: any[] = []
  constructor(private fb: FormBuilder) { }
  ngOnInit() {
  }

  showText() {
    try {
      var obj = JSON.parse(this.jsonObject);
      this.show = true
      this.showJsonError = false
      let arr: any[] = [];
      Object.keys(obj).map((key) => {
        arr.push({ key: key, value: obj[key] })
        this.allData = arr
        return arr;
      });
      this.allData.forEach(item => {
        let numPattern = /^[0-9\-]+$/ || /^\d+(\/\d+)*$/;
        let type = typeof (item.value)
        if (type == "string") {
          item.type = "text"
          if (numPattern.test(item.value) == true) {
            item.type = "date"
            item.value = moment(item.value).format('DD/MM/YYYY')
          }
        }
        if (type == "number") {
          item.type = "number"
        }
        if (type == "boolean") {
          item.type = "checkbox"
        }
        if (type == "object") {
          item.type = "dropdown"
          this.dropDownOptions = Object.entries(item.value)

        }
      })
      this.allInputs = this.allData;
      this.dropDownOptions.forEach((element: any[]) => {
        let index = this.dropdownItems.indexOf(element[1])
        if (index == -1) {
          this.dropdownItems.push(element[1])
        }
      });
      this.allInputs.forEach(x => {
        this.form.addControl(x.key, new FormControl(x.value))
      })

    } catch (e) {
      this.showJsonError = true
    }
  }
  cancelForm() {
    this.form.reset()
  }
  saveForm() {
    if (this.form.valid) {
      alert('Data Saved Successfully')
    }
  }
}