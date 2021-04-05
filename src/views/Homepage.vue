<template>
  <div>
    <b-jumbotron
      header="Basic Budget"
      lead="Simple tool for visualizing expenses"
    >
      <p>For more information visit website</p>
      <b-button variant="primary" href="#" to="/register/">Sign Up</b-button>
    </b-jumbotron>
    <b-container class="home-container">
      <b-row>
        <b-col
          ><v-chart class="chart" ref="chart" :option="option" autoresize />
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <h4>Easily see your budget</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc sed
            blandit libero volutpat. Non odio euismod lacinia at quis risus sed.
            Massa eget egestas purus viverra accumsan in nisl. Sagittis nisl
            rhoncus mattis rhoncus. Id donec ultrices tincidunt arcu non
            sodales. Leo in vitae turpis massa sed.
          </p>
        </b-col>
        <b-col sm="4"
          ><h4>Import from popular tools</h4>
          <p>
            Tincidunt id aliquet risus feugiat in ante metus dictum. Rhoncus
            aenean vel elit scelerisque mauris. Dui id ornare arcu odio ut sem
            nulla pharetra diam. Risus feugiat in ante metus dictum at tempor
            commodo ullamcorper.
          </p></b-col
        >
        <b-col sm="4"
          ><h4>Completely Free</h4>
          <p>
            Lorem donec massa sapien faucibus et molestie ac feugiat sed.
            Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor
            posuere. Vestibulum morbi blandit cursus risus at ultrices mi.
          </p></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <h3 class="footer-title">Get Started</h3>
          <b-button variant="primary">Sign Up</b-button>
          <br />
          <a href="#" class="small-link">I already have an account</a></b-col
        >
      </b-row>
    </b-container>
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
import ExampleDataService from "../services/ExampleDataService";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "Homepage",
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  data() {
    return {
      option: {
        title: {
          text: "My Budget",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}$ ({d}%)",
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
    };
  },
  mounted: function () {
    var vue = this;
    ExampleDataService.getService()
      .getFields()
      .then((fields) => {
        console.log(fields);
        vue.option.legend.data = fields;
      });

    ExampleDataService.getService()
      .getExampleExpenses()
      .then((expenses) => {
        vue.option.series[0].data = expenses.map((expense) => {
          var item = {};
          item.value = expense.Cost;
          item.name = expense.Category;
          return item;
        });
      });
  },
};
</script>

<style>
.chart {
  min-height: 400px;
  width: 100%;
}
.home-container {
  width: 80%;
  text-align: center;
}
.small-link {
  font-size: 12px;
}
.footer-title {
  padding-bottom: 1%;
}
body {
  padding-bottom: 3%;
}
</style>