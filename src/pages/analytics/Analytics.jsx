import { Badge, Box, styled, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Overview from "./Overview";
import { 
  FaChartBar, 
  FaCog, 
  FaChartLine, 
  FaClipboardList, 
  FaFileAlt,
  FaIndustry,
  FaTshirt
} from "react-icons/fa";
import DateRangePicker from "../../components/input/DateRangePicker";
import { useGetAnalysisQuery, useGetOutputLast48hrsQuery } from "../../redux/feature/analysis/analysisApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDateFrom, setDateTo } from "../../redux/feature/analysis/analysisSlice";
import dayjs from "dayjs";
import LoadingComponent from "../../components/ui/LoadingComponent";
import useWebsocketServer from "../../hook/useWebsocketServer";
import { useTranslation } from "react-i18next";

export default function Analytics() {
    // -- state ---------------------------------------------------------------------------------------
    const [value, setValue] = useState(0);

    // -- selector ------------------------------------------------------------------------------------
    const dateFrom      = useSelector((state) => state.analysis.dateFrom);
    const dateTo        = useSelector((state) => state.analysis.dateTo);
    
    // console.log(dateFrom, dateTo);
    // -- Hook ----------------------------------------------------------------------------------------
    const dispatch = useDispatch();
    const {t} = useTranslation();

    // -- Query ---------------------------------------------------------------------------------------
    // if no data get last 28 day
    const {data: analysisData, 
        isSuccess: isAnalysisDataSuccess, 
        isLoading: isAnalysisDataLoading,
        refetch: refetchAnalysisData
    } = useGetAnalysisQuery({
        dateFrom: dateFrom ? dateFrom : dayjs().subtract(28, "day").format("YYYY-MM-DD"),
        dateTo: dateTo ? dateTo : dayjs().format("YYYY-MM-DD"),
    });
    
    const {
        data: outputLast48hrsData,
        isSuccess: isOutputLast48hrsDataSuccess,
        isLoading: isOutputLast48hrsDataLoading,
        refetch: refetchOutputLast48hrs,
    } = useGetOutputLast48hrsQuery();

    const { messages } = useWebsocketServer(`/topic/messages/tv-data-update`);

    useEffect(() => {
        if (messages.isUpdate === true) {
            refetchOutputLast48hrs();
            refetchAnalysisData();
        }
    }, [messages, refetchOutputLast48hrs]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let content;

    if (isAnalysisDataLoading || isOutputLast48hrsDataLoading) {
        content = <LoadingComponent/>;
    } 

    if (isAnalysisDataSuccess && isOutputLast48hrsDataSuccess) {
        content = (
            <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FaChartBar className="text-blue-400" size={24} />
                    <p className="text-white text-xl font-bold">{t('manufacturingAnalytics')}</p>
                </div>
            </div>
            
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2
                 }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="analytics tabs"
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#3b82f6",
                            },
                        }}
                    >
                        <Tab 
                            label="Overview" 
                            value={0} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textTransform: 'none',
                                "&.Mui-selected": { 
                                    color: 'white',
                                },
                            }} 
                        />
                        
                    </Tabs>
                    <DateRangePicker
                        onChange={({ start, end }) => {
                            dispatch(setDateFrom(start));
                            dispatch(setDateTo(end));
                        }}
                    />
                </Box>
                  
                {value === 0 && <Overview data={analysisData} outputLast48hrsData={outputLast48hrsData}/>}
                {value === 1 && <ProductionLine />}
                {value === 2 && <StyleDetail />}
            </Box>
        </div>
        );
    }

    return content;
}
