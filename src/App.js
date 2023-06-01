import  {Routes, Route, Navigate} from 'react-router-dom'
import { Games } from './screenes/Games'
import { Programs } from './screenes/Programs'
import { Notfoundpage } from './components/Notfoundpage'
import { Drinks } from './screenes/Drinks'
import { Snacks } from './screenes/Snacks'
import { Courses } from './screenes/Сourses'
import { Layout } from './common/Layout'
import React, {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [configurationId, setConfigurationId] = useState(null);
    const [configurationName, setConfigurationName] = useState(null);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const handleNewConfigurationActive = (id) => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${id}`)
                setConfigurationId(response.data.payload[0].id);
                setConfigurationName(response.data.payload[0].name)
                setWidth(response.data.payload[0].width)
                setHeight(response.data.payload[0].height)
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().then();
    };
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response1 = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/settings/active_configuration`);
                const id = response1.data.payload[0].value;

                const response2 = await axios.get(`https://dcc4.langame.ru/configurator-api/api/v1/shell/configurations/${id}`);
                setConfigurationId(response2.data.payload[0].id);
                setConfigurationName(response2.data.payload[0].name)
                setWidth(response2.data.payload[0].width)
                setHeight(response2.data.payload[0].height)
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().then();
    }, []);
    return (
        <>
            {isLoading && <div>Loading...</div>}
            {!isLoading && (<Routes>
                <Route path="/" element={<Layout configurationName={configurationName} configurationId={configurationId} onNewConfigurationActive={handleNewConfigurationActive}/>}>
                    <Route index element={<Navigate replace to="/games" />}></Route>
                    <Route path="games" element={<Games width={width} height={height} configurationId={configurationId}/>}></Route>
                    <Route path="programs" element={<Programs  width={width} height={height} configurationId={configurationId} />}></Route>
                    <Route path="drinks" element={<Drinks  width={width} height={height} configurationId={configurationId} />}></Route>
                    <Route path="snacks" element={<Snacks  width={width} height={height} configurationId={configurationId} />}></Route>
                    <Route path="courses" element={<Courses  width={width} height={height} configurationId={configurationId} />}></Route>
                    <Route path="*" element={<Notfoundpage />}></Route>
                </Route>
            </Routes>)}
        </>
    )
}

export default App;