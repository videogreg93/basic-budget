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
    <b-form-file
      :state="Boolean(file1)"
      @change="onFileChange"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept=".csv"
    ></b-form-file>
    <b-row>
      <v-chart class="chart" id="chart1" :option="option" />
      <v-chart class="chart" id="chart2" :option="option2" />
    </b-row>
    <b-table striped hover :items="expenses" :fields="fields"></b-table>
  </b-container>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import csv from "jquery-csv";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

window.onresize = function () {
  use.init(document.getElementById("chart1")).resize();
  use.init(document.getElementById("chart2")).resize();
};

export default {
  name: "HelloWorld",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  methods: {
    onFileChange(e) {
      var vue = this;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // We're filtering for only 2021 because of bad data before
        var objects = csv
          .toObjects(e.target.result)
          .filter((element) => element.Date.split("-")[0] == 2021);
        vue.expenses = objects;
        vue.fields = csv.toArrays(e.target.result)[0].map(vue.toField);
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
        vue.getMonthlyCosts();
        vue.showSuccess = 3;
        vue.successAlertMessage = "File imported!";
      };
      reader.readAsText(file);
    },
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
      vue.averageCostPerMonth = Array.from(vue.categories).map((category) => {
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
      vue.option2.series[0].data = Array.from(vue.averageCostPerMonth);
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
  },
  data() {
    return {
      option: {
        title: {
          text: "Total Costs",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "Direct",
            "Email",
            "Ad Networks",
            "Video Ads",
            "Search Engines",
          ],
        },
        series: [
          {
            name: "All Time",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
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
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "Monthly",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
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
      items: [],
      fields: [],
      totalCostsPerMonth: [],
      showSuccess: false,
      successAlertMessage: "",
    };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-flow: column wrap;
}
.chart {
  min-height: 400px;
  width: 50%;
}
</style>