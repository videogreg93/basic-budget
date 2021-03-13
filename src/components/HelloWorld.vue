<template>
  <div class="container">
    <form enctype="multipart/form-data">
      <input type="file" @change="onFileChange" />
    </form>
    <v-chart class="chart" :option="option" />
    <b-table striped hover :items="expenses" :fields="fields"></b-table>
  </div>
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
        var objects = csv.toObjects(e.target.result).filter(element => element.Date.split("-")[0] == 2021);
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
      };
      reader.readAsText(file);
    },
    mapToCategories(item) {
      return item.Category;
    },
    toField(item) {
      var field = {}
      field.key = item;
      field.sortable = true;
      return field;
    }
  },
  data() {
    return {
      option: {
        title: {
          text: "Basic Budget",
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
      categories: [],
      expenses: [],
      items: [],
      fields : []
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
  width: 100%;
}
</style>