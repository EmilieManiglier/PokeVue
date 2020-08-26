<template>
  <div>
    <stats-chart :chartdata="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import StatsChart from "@/components/PokemonDetail/StatsChart";
import { mapState } from "vuex";

export default {
  components: { StatsChart },
  computed: {
    ...mapState(['stats', 'firstType']),
    background() {
      return this.colors.find(type => type.name === this.firstType).lightColor;
    },
    border() {
      return this.colors.find(type => type.name === this.firstType).color;
    },
    chartData() {
      return {
        labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
        datasets: [
          {
            borderWidth: 1,
            backgroundColor: [
              this.background,
              this.background,
              this.background,
              this.background,
              this.background,
              this.background,
            ],
            borderColor: [
              this.border,
              this.border,
              this.border,
              this.border,
              this.border,
              this.border,
            ],
            data: this.stats
          }
        ]
      };
    },
    chartOptions() {
      return {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                max: 255,
                stepSize: 100,
                beginAtZero: true
              },
              gridLines: {
                display: false
              },
            }
          ]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      };
    }
  },
  data() {
    return {
      colors: [
        {
          name: "bug",
          color: "#A8B820",
          lightColor: "#C6D16E"
        },
        {
          name: "dark",
          color: "#705848",
          lightColor: "#A29288"
        },
        {
          name: "dragon",
          color: "#7038F8",
          lightColor: "#A27DFA"
        },
        {
          name: "electric",
          color: "#F8D030",
          lightColor: "#FAE078"
        },
        {
          name: "fairy",
          color: "#EE99AC",
          lightColor: "#F4BDC9"
        },
        {
          name: "fighting",
          color: "#C03028",
          lightColor: "#D67873"
        },
        {
          name: "fire",
          color: "#F08030",
          lightColor: "#F5AC78"
        },
        {
          name: "flying",
          color: "#A890F0",
          lightColor: "#C6B7F5"
        },
        {
          name: "ghost",
          color: "#705898",
          lightColor: "#A292BC"
        },
        {
          name: "grass",
          color: "#78C850",
          lightColor: "#A7DB8D"
        },
        {
          name: "ground",
          color: "#E0C068",
          lightColor: "#EBD69D"
        },
        {
          name: "ice",
          color: "#98D8D8",
          lightColor: "#BCE6E6"
        },
        {
          name: "normal",
          color: "#A8A878",
          lightColor: "#C6C6A7"
        },
        {
          name: "poison",
          color: "#A040A0",
          lightColor: "#C183C1"
        },
        {
          name: "psychic",
          color: "#F85888",
          lightColor: "#FA92B2"
        },
        {
          name: "rock",
          color: "#B8A038",
          lightColor: "#D1C17D"
        },
        {
          name: "steel",
          color: "#B8B8D0",
          lightColor: "#D1D1E0"
        },
        {
          name: "water",
          color: "#6890F0",
          lightColor: "#9DB7F5"
        }
      ]
    };
  }
};
</script>

