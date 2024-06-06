import express from "express";
import axios from "axios";
import bodyParser from "body-parser"

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://epic.gsfc.nasa.gov/api/enhanced/date/2024-06-02");
        const result = response.data;
        res.render("index.ejs");
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
    }
});

app.post("/go", async (req, res) => {
    try {
        let selectedDate = new Date(req.body.selectedDate);
        let selectedYear = selectedDate.getFullYear().toString();

        let selectedMonth = 1 + selectedDate.getUTCMonth();
        if (selectedMonth < 10) {
            selectedMonth = "0" + selectedMonth.toString();
        } else {
            selectedMonth = selectedMonth.toString();
        }

        let selectedDay = selectedDate.getUTCDate();
        if (selectedDay < 10) {
            selectedDay = "0" + selectedDay.toString();
        } else {
            selectedDay = selectedDay.toString();
        }

        console.log(selectedDate, selectedYear, selectedMonth, selectedDay);

        const response = await axios.get(`https://epic.gsfc.nasa.gov/api/enhanced/date/${req.body.selectedDate}`);
        const result = response.data;
        console.log(result[0].identifier, result[0].centroid_coordinates.lat, result[0].centroid_coordinates.lon);

        res.render("index.ejs", {imgName: result[0].identifier, year: selectedYear, month: selectedMonth, day: selectedDay, date: result[0].date, lat: result[0].centroid_coordinates.lat, lon: result[0].centroid_coordinates.lon})
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});