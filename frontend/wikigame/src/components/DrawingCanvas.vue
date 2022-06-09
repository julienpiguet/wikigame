<template>
    <v-card class="mb-4">
        <div class="flex-row">
            <div class="source">
                <p>Canvas:</p>
                <vue-drawing-canvas ref="VueCanvasDrawing" v-model:image="image" :width="600" :height="400"
                    :stroke-type="strokeType" :line-cap="lineCap" :line-join="lineJoin" :fill-shape="fillShape"
                    :eraser="eraser" :lineWidth="line" :color="color" :background-color="backgroundColor"
                    :background-image="backgroundImage" :watermark="watermark" :initial-image="initialImage"
                    saveAs="png" :styles="{
                        border: 'solid 1px #000',
                    }" :lock="disabled" @mousemove="getCoordinate($event)" :additional-images="additionalImages" />
                <p>
                    ({{ x }},{{ y }})
                </p>
                <div class="button-container">
                    <button type="button" @click.prevent="$refs.VueCanvasDrawing.undo()">
                        <v-icon icon="mdi-undo" />Undo
                    </button>
                    <button type="button" @click.prevent="$refs.VueCanvasDrawing.redo()">
                        <v-icon icon="mdi-redo" />Redo
                    </button>
                    <button type="button" @click.prevent="$refs.VueCanvasDrawing.redraw()">
                        <v-icon icon="mdi-refresh" />Refresh
                    </button>
                    <button type="button" @click.prevent="$refs.VueCanvasDrawing.reset()">
                        <v-icon icon="mdi-delete" />Reset
                    </button>
                </div>
                <div class="button-container">
                    <button type="button" @click.prevent="eraser = !eraser">
                        <span v-if="eraser">
                            <v-icon icon="mdi-eraser" />Eraser
                        </span>
                        <span v-else>
                            <v-icon icon="mdi-pencil" />Draw
                        </span>
                    </button>
                    <select v-model="line">
                        <option v-for="n in 25" :key="'option-' + n" :value="n">
                            {{ n }}
                        </option>
                    </select>
                    <input type="color" v-model="color" />
                    <select v-model="strokeType">
                        <option value="dash">
                            <v-icon icon="mdi-draw" />Dash
                        </option>
                        <option value="line">
                            <v-icon icon="mdi-minus" />Straight Line
                        </option>
                        <option value="circle">
                            <v-icon icon="mdi-checkbox-blank-circle-outline" />Circle
                        </option>
                        <option value="square">
                            <v-icon icon="mdi-crop-square" />Square
                        </option>
                        <option value="triangle">
                            <v-icon icon="mdi-triangle-outline" />Triangle
                        </option>
                        <option value="half_triangle">
                            <v-icon icon="mdi-angle-right" />Right Triangle
                        </option>
                    </select>
                    <button type="button" @click.prevent="fillShape = !fillShape">
                        <span v-if="fillShape">
                            <v-icon icon="mdi-square-rounded" />Fill
                        </span>
                        <span v-else>
                            <v-icon icon="mdi-square-rounded-outline" />Stroke
                        </span>
                    </button>
                </div>
                <div class="button-container">
                    <div style="margin-right: 30px">
                        <p style="margin-bottom: 0">Background Color:</p>
                        <input type="color" v-model="backgroundColor" />
                    </div>
                    <div>
                        <p style="margin-bottom: 0">Upload Background Image:</p>
                        <input type="file" @change="setImage($event)" />
                    </div>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script>
import VueDrawingCanvas from "vue-drawing-canvas";

export default {
    name: "DrawingCanvas",
    components: {
        VueDrawingCanvas,
    },
    data() {
        return {
            initialImage: [
                {
                    type: "dash",
                    from: {
                        x: 262,
                        y: 154,
                    },
                    coordinates: [],
                    color: "#000000",
                    width: 5,
                    fill: false,
                },
            ],
            x: 0,
            y: 0,
            image: "",
            eraser: false,
            disabled: false,
            fillShape: false,
            line: 5,
            color: "#000000",
            strokeType: "dash",
            lineCap: "round",
            lineJoin: "round",
            backgroundColor: "#FFFFFF",
            backgroundImage: null,
            watermark: null,
            additionalImages: [],
        };
    },
    mounted() {
        if ("vue-drawing-canvas" in window.localStorage) {
            this.initialImage = JSON.parse(
                window.localStorage.getItem("vue-drawing-canvas")
            );
        }
    },
    methods: {
        async setImage(event) {
            let URL = window.URL;
            this.backgroundImage = URL.createObjectURL(event.target.files[0]);
            await this.$refs.VueCanvasDrawing.redraw();
        },
        getCoordinate(event) {
            let coordinates = this.$refs.VueCanvasDrawing.getCoordinates(event);
            this.x = coordinates.x;
            this.y = coordinates.y;
        }
    },
    watch: {
        image(newimage) {
            this.$store.commit("SET_IMAGE", newimage);
        }
    },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,700&display=swap");

body {
    font-family: "Roboto", sans-serif;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.button-container {
    display: flex;
    flex-direction: row;
}

.button-container>* {
    margin-top: 15px;
    margin-right: 10px;
}
</style>