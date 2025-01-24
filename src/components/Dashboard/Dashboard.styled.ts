import styled from "styled-components"

export const Container = styled.div`
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
    text-align: center;
    color: #333;
`;

export const Section = styled.div`
    margin-top: 20px;
`;

export const SectionTitle = styled.h2`
    text-align: center;
    color: #333;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
`;

export const TableHead = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
`;

export const TableRow = styled.tr`
    border: 1px solid #ddd;
`;

export const TableCell = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
`;

export const WeatherIcon = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

export const WeatherSearchWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;