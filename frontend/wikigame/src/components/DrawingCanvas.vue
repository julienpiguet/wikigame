<template>
    <v-card class="mb-4">
        <div class="d-flex flex-column mt-4">
            <div class="ma-auto">
                <div class="my-3">
                    <vue-drawing-canvas ref="VueCanvasDrawing" v-model:image="image" :width="600" :height="400"
                        :stroke-type="shape.name" :line-cap="lineCap" :line-join="lineJoin" :fill-shape="fillShape"
                        :eraser="eraser" :lineWidth="line" :color="color" :background-color="backgroundColor"
                        :background-image="backgroundImage" :watermark="watermark" :initial-image="initialImage"
                        saveAs="png" :styles="{
                            border: 'solid 1px #000',
                        }" :lock="disabled" @mousemove="getCoordinate($event)" :additional-images="additionalImages" />
                </div>
                <div class="d-flex flex-row mb-4">
                    <v-btn @click.prevent="$refs.VueCanvasDrawing.undo()" class="mr-2">
                        <v-icon icon="mdi-undo" />Undo
                    </v-btn>
                    <v-btn @click.prevent="$refs.VueCanvasDrawing.redo()" class="mr-2">
                        <v-icon icon="mdi-redo" />Redo
                    </v-btn>
                    <v-btn @click.prevent="$refs.VueCanvasDrawing.redraw()" class="mr-2">
                        <v-icon icon="mdi-refresh" />Refresh
                    </v-btn>
                    <v-btn @click.prevent="$refs.VueCanvasDrawing.reset()" class="mr-2">
                        <v-icon icon="mdi-delete" />Reset
                    </v-btn>
                </div>
                <div class="d-flex flex-row mb-4">
                    <div class="d-flex" style="width: 100%">
                        <v-slider v-model="line" :min="1" :max="50" :step="1" thumb-label hide-details
                            append-icon="mdi-checkbox-blank-circle" prepend-icon="mdi-circle-medium"></v-slider>
                    </div>
                    <div style="width: 80px">
                        <v-text-field v-model="line" hide-details single-line variant="outlined" density="compact"
                            type="number"></v-text-field>
                    </div>
                </div>
                <div class="d-flex flex-row mb-4 align-center">
                    <v-btn @click.prevent="eraser = !eraser" class="mr-2" icon size="small">
                        <span v-if="eraser">
                            <v-icon icon="mdi-eraser" />
                            <v-tooltip activator="parent" location="top" >Eraser</v-tooltip>
                        </span>
                        <span v-else>
                            <v-icon icon="mdi-pencil" />
                            <v-tooltip activator="parent" location="top" >Pencil</v-tooltip>
                        </span>
                    </v-btn>
                    <v-btn @click.prevent="fillShape = !fillShape" icon class="mr-2" size="small">
                        <span v-if="fillShape">
                            <v-icon icon="mdi-square-rounded" />
                            <v-tooltip activator="parent" location="top" >Fill</v-tooltip>
                        </span>
                        <span v-else>
                            <v-icon icon="mdi-square-rounded-outline" />
                            <v-tooltip activator="parent" location="top" >Stroke</v-tooltip>
                        </span>
                    </v-btn>
                    <input type="color" v-model="color" class="mr-2" />
                    <div style="width: 220px">
                        <v-select v-model="shape" :items="shapes" item-title="text" item-value="name" :prepend-icon="shape.icon" variant="outlined" density="compact" hide-details return-object single-line></v-select>
                    </div>
                </div>
                <div class="d-flex flex-row mb-4">
                    <div class="d-flex flex-row mr-4">
                        <div class="mr-4">
                            <p style="margin-bottom: 0">Background Color:</p>
                            <input type="color" v-model="backgroundColor" />
                        </div>
                        <v-btn @click.prevent="$refs.VueCanvasDrawing.redraw()" >
                            <v-icon icon="mdi-check" />Apply
                        </v-btn>
                    </div>
                    <div class="mr-1">
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
            shape: {name: 'dash', icon: 'mdi-draw', text: 'Dash'},
            shapes: [
                {name: 'dash', icon: 'mdi-draw', text: 'Dash'},
                {name: 'line', icon: 'mdi-minus', text: 'Straight Line'},
                {name: 'circle', icon: 'mdi-checkbox-blank-circle-outline', text: 'Circle'},
                {name: 'square', icon: 'mdi-crop-square', text: 'Square'},
                {name: 'triangle', icon: 'mdi-triangle-outline', text: 'Triangle'},
                {name: 'half_triangle', icon: 'mdi-angle-right', text: 'Right Triangle'}
            ]
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