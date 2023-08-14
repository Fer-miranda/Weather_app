import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Weather = () => {
    const [search, setSearch] = useState("seul");
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [localTime, setLocalTime] = useState("");

    let componentMounted = true;

    useEffect(() => {
        const fetchWeather = async () => {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=43e7673569911f16f2b63821ef9b354d
            `);
            if (componentMounted) {
                setData(await response.json());
                console.log(data)
            };
            return () => {
                componentMounted = false;
            }
        }
        fetchWeather();

    }, [search]);

    useEffect(() => {
        if (data && data.timezone) {
            const timezoneOffsetMilliseconds = data.timezone * 1000;
            const currentTime = Date.now();
            const localTimeInMilliseconds = currentTime + timezoneOffsetMilliseconds;
            const localDate = new Date(localTimeInMilliseconds);
            const dstOffset = localDate.getTimezoneOffset() * 60 * 1000;
            setLocalTime(new Date(localTimeInMilliseconds + dstOffset));
        }
    }, [data]);


    let emoji = null;
    if (typeof data.main !== "undefined") {
        if (data.weather[0].main === "Clouds") {
            emoji = "fa-cloud"
        } else if (data.weather[0].main === "Thunderstorm") {
            emoji = "fa-bolt"
        } else if (data.weather[0].main === "Drizzle") {
            emoji = "fa-cloud-rain"
        } else if (data.weather[0].main === "Rain") {
            emoji = "fa-cloud-rain"
        } else if (data.weather[0].main === "Snow") {
            emoji = "fa-snowflake"
        } else if (data.weather[0].main === "Clear") {
            emoji = "fa-sun"
        } else {
            emoji = "fa-smog"
        }
    } else {
        return (
            <div>city not found</div>
        )
    }

    let temp = (data.main.temp - 273.15).toFixed(0);
    let temp_min = (data.main.temp_min - 273.15).toFixed(0);
    let temp_max = (data.main.temp_max - 273.15).toFixed(0);
    let sen_ter = (data.main.feels_like - 273.15).toFixed(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSearch(input);

    };

    return (
        <div>
            {/* <h1>SearchWeather</h1> */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <Card className="card text-white text-center body-0">
                            <Card.Img src={`https://source.unsplash.com/random/600x900/?${data.weather[0].main}`} alt="Card image" />
                            <Card.ImgOverlay>
                                <form onSubmit={handleSubmit}>
                                    <InputGroup className="mb-4 w-75 mx-auto">
                                        <Form.Control
                                            type="search"
                                            placeholder="Search a city"
                                            name="search"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            required
                                        />
                                        <button type="submit" class="input-group-text">
                                            <i className="fas fa-search" ></i>
                                        </button>
                                    </InputGroup>
                                </form>
                                <div className="bg-dark bg-opacity-50 py-3">
                                    <Card.Title>{data.name}, {data.sys.country}</Card.Title>
                                    <Card.Text className="lead">
                                        {localTime && localTime.toLocaleDateString([], {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                        <br />
                                        {localTime && localTime.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            timeZoneName: "short",
                                        })}
                                    </Card.Text>
                                    <hr />
                                    <i className={`fas ${emoji} fa-4x`}></i>
                                    <h1 className="fw-bolder mb-5">{temp}&deg;C</h1>
                                    <p className="lead">Sensación Térmica: {sen_ter}&deg;C</p>
                                    <p className="lead">Humedad: {data.main.humidity}%</p>
                                    <p className="lead fw-bolder mb-0">{data.weather[0].main}</p>
                                    <p className="lead">MIN {temp_min}&deg;C - MAX {temp_max}&deg;C</p>
                                </div>
                            </Card.ImgOverlay>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Weather;