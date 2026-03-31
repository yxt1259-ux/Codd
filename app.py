import streamlit as st
import requests
import folium
from streamlit_folium import st_folium

# 百度地图API密钥（需要替换为实际的API密钥）
BAIDU_MAP_KEY = "your_baidu_map_key"

# 高德地图API密钥
AMAP_KEY = "94b5f7f03ec26798e4db9cfb603ab130"

# 天气查询函数
def get_weather(city):
    url = f"https://restapi.amap.com/v3/weather/weatherInfo?key={AMAP_KEY}&city={city}&extensions=base"
    response = requests.get(url)
    data = response.json()
    if data['status'] == '1':
        weather_data = data['lives'][0]
        return weather_data
    else:
        return None

# 地理编码函数（将地点转换为经纬度）
def geocode(location):
    url = f"https://restapi.amap.com/v3/geocode/geo?key={AMAP_KEY}&address={location}"
    response = requests.get(url)
    data = response.json()
    if data['status'] == '1' and len(data['geocodes']) > 0:
        location = data['geocodes'][0]['location']
        return location.split(',')
    else:
        return None

# 路线规划函数
def get_route(origin, destination, strategy=0):
    origin_lng, origin_lat = geocode(origin)
    dest_lng, dest_lat = geocode(destination)
    
    if not origin_lng or not dest_lng:
        return None
    
    url = f"https://restapi.amap.com/v3/direction/driving?key={AMAP_KEY}&origin={origin_lng},{origin_lat}&destination={dest_lng},{dest_lat}&strategy={strategy}"
    response = requests.get(url)
    data = response.json()
    
    if data['status'] == '1':
        return data['route']
    else:
        return None

# 逆地理编码函数（将经纬度转换为地点名称）
def reverse_geocode(lng, lat):
    url = f"https://restapi.amap.com/v3/geocode/regeo?key={AMAP_KEY}&location={lng},{lat}"
    response = requests.get(url)
    data = response.json()
    if data['status'] == '1':
        return data['regeocode']
    else:
        return None

# 主应用
st.set_page_config(page_title="云南天气地图", layout="wide")

# 自定义CSS
st.markdown("""
<style>
    .main {
        background-color: #f0f2f6;
    }
    .title {
        color: #1a73e8;
        text-align: center;
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
    }
    .subheader {
        color: #333;
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .weather-card {
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
    .map-container {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>
""", unsafe_allow_html=True)

# 页面标题
st.markdown('<h1 class="title">云南天气地图</h1>', unsafe_allow_html=True)

# 选项卡
tab1, tab2 = st.tabs(["云南地图", "路线规划"])

with tab1:
    # 云南省中心坐标
    yunnan_center = [25.0389, 102.7183]
    
    # 创建地图
    m = folium.Map(location=yunnan_center, zoom_start=7)
    
    # 添加云南省边界（使用简化的边界数据）
    yunnan_boundary = [
        [29.22, 97.42], [29.22, 106.16], [21.09, 106.16], [21.09, 97.42], [29.22, 97.42]
    ]
    folium.Polygon(locations=yunnan_boundary, color='blue', weight=2, fill=True, fill_color='lightblue', fill_opacity=0.2).add_to(m)
    
    # 显示地图并获取点击事件
    map_data = st_folium(m, width=1200, height=600, key="yunnan_map", returned_objects=["last_clicked"])
    
    # 处理点击事件
    if map_data.get("last_clicked"):
        lat = map_data["last_clicked"]["lat"]
        lng = map_data["last_clicked"]["lng"]
        
        # 逆地理编码获取地点信息
        regeo_data = reverse_geocode(lng, lat)
        if regeo_data:
            address = regeo_data['formatted_address']
            city = regeo_data['addressComponent'].get('city', '')
            district = regeo_data['addressComponent'].get('district', '')
            township = regeo_data['addressComponent'].get('township', '')
            
            # 构建地点名称
            location_name = address
            
            # 获取天气信息
            weather_city = city if city else district if district else township
            if weather_city:
                weather = get_weather(weather_city)
                if weather:
                    st.markdown('<div class="weather-card">', unsafe_allow_html=True)
                    st.subheader(f"{location_name} 天气")
                    col1, col2, col3, col4 = st.columns(4)
                    with col1:
                        st.metric("天气", weather['weather'])
                    with col2:
                        st.metric("温度", f"{weather['temperature']}°C")
                    with col3:
                        st.metric("湿度", f"{weather['humidity']}%")
                    with col4:
                        st.metric("风力", weather['windpower'])
                    st.write(f"风向: {weather['winddirection']}")
                    st.write(f"更新时间: {weather['reporttime']}")
                    st.markdown('</div>', unsafe_allow_html=True)
                else:
                    st.warning(f"无法获取{weather_city}的天气信息")
            else:
                st.warning("无法获取地点信息")

with tab2:
    st.markdown('<h2 class="subheader">路线规划与沿途天气</h2>', unsafe_allow_html=True)
    
    # 用户输入
    col1, col2 = st.columns(2)
    with col1:
        origin = st.text_input("起始地")
    with col2:
        destination = st.text_input("目的地")
    
    if st.button("查询路线"):
        if origin and destination:
            # 获取三种路线方案
            strategies = [
                (0, "最快路线"),
                (1, "最短路线"),
                (2, "避开高速")
            ]
            
            routes = []
            for strategy, name in strategies:
                route = get_route(origin, destination, strategy)
                if route:
                    routes.append((name, route))
            
            if routes:
                # 选择路线方案
                selected_route = st.selectbox("选择路线方案", [name for name, _ in routes])
                
                # 获取选中的路线数据
                for name, route in routes:
                    if name == selected_route:
                        selected_route_data = route
                        break
                
                # 显示路线信息
                st.subheader(f"{selected_route}信息")
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("总距离", f"{selected_route_data['paths'][0]['distance']}米")
                with col2:
                    st.metric("预计时间", f"{selected_route_data['paths'][0]['duration']}秒")
                
                # 提取路线坐标
                polyline = selected_route_data['paths'][0]['polyline']
                coordinates = []
                for point in polyline.split(';'):
                    lng, lat = point.split(',')
                    coordinates.append([float(lat), float(lng)])
                
                # 创建地图
                route_map = folium.Map(location=[coordinates[0][0], coordinates[0][1]], zoom_start=10)
                
                # 添加路线
                folium.PolyLine(coordinates, color="blue", weight=2.5, opacity=1).add_to(route_map)
                
                # 添加起点和终点标记
                folium.Marker([coordinates[0][0], coordinates[0][1]], popup=origin, icon=folium.Icon(color='green')).add_to(route_map)
                folium.Marker([coordinates[-1][0], coordinates[-1][1]], popup=destination, icon=folium.Icon(color='red')).add_to(route_map)
                
                # 显示地图
                st_folium(route_map, width=1200, height=400, key="route_map")
                
                # 显示沿途天气
                st.subheader("沿途天气")
                
                # 提取途经点（每10个点取一个）
                waypoints = coordinates[::10]
                for i, point in enumerate(waypoints):
                    # 逆地理编码获取地点名称
                    lat, lng = point
                    regeo_data = reverse_geocode(lng, lat)
                    
                    if regeo_data:
                        address = regeo_data['formatted_address']
                        city = regeo_data['addressComponent'].get('city', '')
                        district = regeo_data['addressComponent'].get('district', '')
                        weather_city = city if city else district
                        
                        if weather_city:
                            weather = get_weather(weather_city)
                            if weather:
                                st.markdown('<div class="weather-card">', unsafe_allow_html=True)
                                st.write(f"{i+1}. {address}")
                                col1, col2, col3, col4 = st.columns(4)
                                with col1:
                                    st.write(f"天气: {weather['weather']}")
                                with col2:
                                    st.write(f"温度: {weather['temperature']}°C")
                                with col3:
                                    st.write(f"风向: {weather['winddirection']}")
                                with col4:
                                    st.write(f"湿度: {weather['humidity']}%")
                                st.markdown('</div>', unsafe_allow_html=True)
            else:
                st.error("无法获取路线信息，请检查输入的地点是否正确")
        else:
            st.error("请输入起始地和目的地")
