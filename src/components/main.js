import { useState, useEffect } from 'react';
import './main.css';

export const Main = () => {

    const [data, setData] = useState([]);
    const [mainId, setMainId] = useState(0);
    const [cardData, setCardData] = useState([]);
    const [mainData, setMainData] = useState([]);
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/albums')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [])

    const handleSearchChange = (event) => {
        let value = event.target.value;

        setSearchTerm(value);

        let tempArr = mainData.map((element) => {
            return { ...element, items: element.items.filter((d) => d.title.includes(value.trim())) }
        })

        let newArr = tempArr.filter((d, i) => {
            return d.items.length !== 0
        })

        setCardData(newArr);

        let tempList = []

        newArr.forEach((d, i) => {
            let arr = [...d.items]
            arr.forEach((data, index) => {
                tempList.push(data)
            })
        })

        if (value === '') {
            setList([]);
        } else {
            setList(tempList);
        }

        setMainId(0);
    };

    function modifyArray(arr, key) {
        // group array with userId as key , items as value and create new key visit in all entries
        const grouped = [];
        arr.forEach(item => {
            item.visit = true
            const keyValue = item[key];
            const existingGroup = grouped.find(group => group.key === keyValue);
            if (existingGroup) {
                existingGroup.items.push(item);
            } else {
                grouped.push({ key: keyValue, items: [item] });
            }
        });
        return grouped;
    }

    useEffect(() => {
        if (data.length > 0) {
            let temp = modifyArray(data, 'userId')
            setCardData(temp);
            setMainData(temp);
        }
    }, [data])

    const handleCardClick = (userId) => {
        cardData.forEach((d, i) => {
            if (userId === d.key) {
                setList(d.items)
            }
        })
        setMainId(userId);
    }

    const findVisitCount = (arr) => {
        let total = 0
        arr.forEach((d, i) => {
            if (d.visit === true) {
                total = total + 1
            }
        })
        return total;
    }

    const handleListClick = (id, userId) => {
        let tempArr = [...cardData]
        tempArr.forEach((d, i) => {
            if (userId === d.key) {
                let temp = [...d.items]
                temp.forEach((tempData, j) => {
                    if (tempData.id === id) {
                        tempData.visit = false
                    }
                })
            }
        })
        setCardData(tempArr)
    }

    return (
        <div>
            <div className="header">
                <div>
                    Logo
                </div>
                <div>
                    <input className="search" type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
                </div>
            </div>
            <div className="cardlist">
                {cardData?.length > 0 && cardData.map((d, i) => {
                    return (
                        <div className='cardBorder' key={i}>
                            <div key={i} className="card" onClick={() => handleCardClick(d.key)}>
                                <div className="cardLabel">
                                    {d.key}
                                </div>
                                <div className="cardCircle">
                                    {findVisitCount(d.items)}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {cardData?.length === 0 && searchTerm.length > 0 ? <div className='noData'>No Search Result Found</div> : null}
            </div>
            {list?.length > 0 ?
                <div>
                    <div className="header">
                        Logo
                    </div>
                    {mainId !== 0 ?
                        <div className="cardName">
                            Card User ID: {mainId}
                        </div> : null}
                    {searchTerm.length > 0 && mainId === 0 ?
                        <div className="cardName">
                            Search List
                        </div> : null}
                </div>
                : null}
            <div className="itemlist">
                {list?.length > 0 && list.map((d, i) => {
                    return (
                        <div key={i}
                            style={{ backgroundColor: d.visit ? '#ffffff' : '#c0e8fc' }}
                            className="list"
                            onClick={() => handleListClick(d.id, d.userId)}>
                            {d.title}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}