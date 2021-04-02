<template>
  <b-container class="container">
    <h1>Easy Budget</h1>
    <b-alert
      id="alert"
      variant="success"
      :show="showSuccess"
      dismissible
      fade
      >{{ successAlertMessage }}</b-alert
    >
    <b-alert id="alert" variant="danger" :show="showError" dismissible fade>{{
      errorAlertMessage
    }}</b-alert>
    <b-row class="fileRow">
      <import-expenses @onImport="onImport"></import-expenses>
    </b-row>
    <date-filter-input
      v-model="dateRange"
      @dateChange="onDateChange"
      :fromProp="dateRange.from"
      :untilProp="dateRange.until"
    />
    <b-row v-if="expensesExist()">
      <v-chart
        class="chart"
        group="1"
        :option="option"
        autoresize
        @legendselectchanged="legendSelected"
      />
      <v-chart
        class="chart"
        ref="chart"
        group="1"
        id="chart2"
        :option="option2"
        autoresize
      />
    </b-row>
    <!-- Table Containers -->
    <b-row class="accordian-row">
      <b-button v-b-toggle.all-expenses-table-container variant="primary">
        See All Expenses
      </b-button>
    </b-row>
    <b-collapse id="all-expenses-table-container" accordion="expense-accordion">
      <b-button
        variant="primary"
        v-b-toggle.add-expense-form
        class="add-expense-button"
        >Add Expense</b-button
      >
      <b-collapse id="add-expense-form" class="mt-2">
        <b-form inline>
          <b-form-datepicker
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="addExpense.Date"
            placeholder="11/22/66"
          ></b-form-datepicker>
          <b-form-select
            class="mb-2 mr-sm-2 mb-sm-0"
            :options="selectCategories"
            v-model="addExpense.Category"
            placeholder="Category"
          ></b-form-select>
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="addExpense.Description"
            placeholder="Description"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="addExpense.Cost"
            placeholder="Cost"
          ></b-form-input>
          <b-button variant="success" v-on:click="addNewExpense">Add</b-button>
        </b-form>
      </b-collapse>
      <b-table striped hover :items="expenses" :fields="fields">
        <template #cell(actions)="data">
          <b-icon
            icon="trash"
            class="rounded bg-danger p-1 trash-icon"
            variant="light"
            v-on:click="deleteExpense(data.item)"
          ></b-icon>
        </template>
      </b-table>
    </b-collapse>
    <b-row class="accordian-row" v-if="expensesExist()">
      <b-button v-b-toggle.grouped-expenses-table-container variant="primary">
        Expenses grouped by type
      </b-button>
    </b-row>
    <b-collapse
      id="grouped-expenses-table-container"
      accordion="expense-accordion"
    >
      <b-table
        striped
        hover
        :items="costsByCategory"
        :fields="categoryFields"
      ></b-table>
    </b-collapse>
  </b-container>
</template>

<script>
import * as echarts from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import DateFilterInput from "./DateFilterInput.vue";
import ExpensesService from "../services/ExpensesService";
import store from "../store";
import ImportExpenses from "./ImportExpenses.vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "HelloWorld",
  components: {
    VChart,
    DateFilterInput,
    ImportExpenses,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  methods: {
    onImport(objects) {
      var vue = this;
      vue.unfilteredObjects = objects;
      ExpensesService.getService().addExpenses(vue.unfilteredObjects);
      this.updateValues(objects);
      vue.successAlertMessage = "File imported!";
    },
    deleteExpense(expense) {
      console.log(expense);
      var vue = this;
      ExpensesService.getService()
        .deleteExpense(expense)
        .then(() => {
          console.log("Expense deleted!");
          vue.unfilteredObjects = vue.unfilteredObjects.filter((item) => {
            return item.id != expense.id;
          });
          vue.onDateChange();
        });
    },
    addNewExpense(event) {
      var vue = this;
      event.preventDefault();
      ExpensesService.getService()
        .addExpense(this.addExpense)
        .then(() => {
          console.log("Document added!");
          vue.unfilteredObjects.unshift(this.addExpense);
          vue.addExpense = {};
          vue.onDateChange();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    expensesExist() {
      return this.expenses.length != 0;
    },
    onDateChange() {
      var vue = this;
      var from = this.dateRange.from;
      var until = this.dateRange.until;
      var objects = vue.unfilteredObjects.filter(
        (element) => element.Date >= from && element.Date <= until
      );
      this.updateValues(objects);
    },
    legendSelected() {
      console.log("legend Selected");
    },
    updateValues(objects) {
      var vue = this;
      vue.expenses = objects.slice(0, -1);
      vue.categories = new Set(objects.map(vue.mapToCategories));
      vue.option.legend.data = Array.from(vue.categories);
      // For each category, count up the costs
      var costs = [];
      this.categories.forEach((category) => {
        var cost = objects
          .filter((element) => element.Category == category)
          .reduce((acc, val) => acc + parseFloat(val.Cost), 0);
        var item = {};
        item.value = cost;
        item.name = category;
        costs.push(item);
      });
      vue.option.series[0].data = costs;
      vue.costsByCategory = costs;
      vue.getMonthlyCosts();
      vue.showSuccess = 3;
    },
    // Generic function to group objects of an array via the keygetter
    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
    getMonthlyCosts() {
      var vue = this;
      // Group costs month
      var grouped = Array.from(
        vue.groupBy(
          vue.expenses,
          (expense) => expense.Date.split("-")[0] + expense.Date.split("-")[1]
        )
      );

      // Calculate total cost of each category, grouped per month
      vue.totalCostsPerMonth = grouped.map((expenseArray) => {
        var item = {};
        item.date = expenseArray[0];
        item.groupedCosts = Array.from(vue.categories).map((category) => {
          var groupedItem = {};
          groupedItem.category = category;
          groupedItem.cost = expenseArray[1]
            .filter((expense) => expense.Category == category)
            .reduce((acc, val) => acc + parseFloat(val.Cost), 0);
          return groupedItem;
        });
        item.cost = expenseArray[1].reduce(
          (acc, val) => acc + parseFloat(val.Cost),
          0
        );
        return item;
      });

      // Calculate average cost per month, grouped by category
      vue.averageCostsPerMonth = Array.from(vue.categories).map((category) => {
        var result = {};
        result.name = category;
        result.value =
          vue.totalCostsPerMonth
            .map((monthItem) => {
              return monthItem.groupedCosts.find(
                (item) => item.category == category
              );
            })
            .reduce((acc, val) => acc + parseFloat(val.cost), 0) /
          vue.totalCostsPerMonth.length;
        return result;
      });
      vue.option2.series[0].data = Array.from(vue.averageCostsPerMonth);
      vue.averageCostPerMonth =
        grouped
          .map((monthItem) => {
            return monthItem[1].reduce(
              (acc, val) => acc + parseFloat(val.Cost),
              0
            );
          })
          .reduce((acc, val) => acc + val, 0) / grouped.length;
      vue.option2.title.text =
        "Monthly\n" + parseInt(vue.averageCostPerMonth) + "$/month";
    },
    mapToCategories(item) {
      return item.Category;
    },
    toField(item) {
      var field = {};
      field.key = item;
      field.sortable = true;
      return field;
    },
    save() {
      console.log("save");
    },
    reset() {
      this.expenses = [];
      this.categories = [];
      this.items = [];
      this.option.series.forEach((item) => {
        item.data = [];
      });
      this.option2.series.forEach((item) => {
        item.data = [];
      });
      this.inputFile = null;
    },
  },
  computed: {
    selectCategories: function () {
      var vue = this;
      console.log("Categories: " + vue.categories);
      return Array.from(this.categories).map((item) => {
        return item;
      });
    },
  },
  data() {
    return {
      dateRange: {
        from: "2017-01-01",
        until: new Date().toISOString().split("T")[0],
      },
      resize: true,
      option: {
        title: {
          text: "Total Costs",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [],
        },
        series: [
          {
            name: "All Time",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      option2: {
        title: {
          text: "Monthly",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "Monthly",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      categories: [],
      expenses: [],
      unfilteredObjects: [],
      items: [],
      fields: [
        {
          key: "Date",
          sortable: true,
        },
        {
          key: "Description",
          sortable: true,
        },
        {
          key: "Category",
          sortable: true,
        },
        {
          key: "Cost",
          sortable: true,
        },
        {
          key: "Currency",
          sortable: true,
        },
        {
          key: "actions",
          label: "",
        },
      ],
      categoryFields: [
        {
          key: "name",
          label: "Category",
        },
        {
          key: "value",
          label: "Cost",
        },
      ],
      costsByCategory: [],
      totalCostsPerMonth: [],
      averageCostsPerMonth: [],
      averageCostPerMonth: 0.0,
      showError: false,
      showSuccess: false,
      successAlertMessage: "",
      errorAlertMessage: "",
      inputFile: null,
      addExpense: {
        Date: null,
        Category: null,
        Description: "",
        Cost: 0.0,
      },
    };
  },
  mounted: function () {
    var vue = this;
    // vue.fields = csv.toArrays(fileResult)[0].map(vue.toField);
    ExpensesService.getService()
      .getExpenses()
      .then((expenses) => {
        vue.unfilteredObjects = expenses;
        vue.successAlertMessage = "File imported!";
        store.dispatch("onLoadExpenses", expenses);
        this.updateValues(expenses);
      });
    echarts["connect"]("1");
  },
};
</script>

<style>
body {
  overflow-x: hidden; /* Hide horizontal scrollbar */
}
.accordian-row {
  margin-top: 1%;
  margin-bottom: 1%;
}
.container {
  display: flex;
  flex-flow: column wrap;
}
.chart {
  min-height: 400px;
  width: 50%;
}
.fileRow {
  margin-bottom: 2%;
}
.input-button {
  margin-left: 0.5%;
  margin-right: 0.5%;
}
.add-expense-button {
  margin-bottom: 0.5%;
}
.trash-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
}
#add-expense-form {
  margin-bottom: 0.5%;
}
</style>