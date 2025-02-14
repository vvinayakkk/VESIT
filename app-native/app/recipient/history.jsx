import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../component/header";
import { UserContext } from "../../context/UserContext";
import { format } from "date-fns";

const API_URL = "http://192.168.31.15:4000";

// Styled Tab Button Component
const TabButton = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderBottomWidth: isActive ? 4 : 0,
      borderBottomColor: isActive ? "#3B82F6" : "transparent",
      backgroundColor: isActive ? "white" : "#E5E7EB",
      borderTopLeftRadius: label === "Requests" ? 10 : 0,
      borderTopRightRadius: label === "Live" ? 10 : 0,
    }}
  >
    <Text style={{ 
      fontWeight: "600", 
      color: isActive ? "#1D4ED8" : "#6B7280", 
      fontSize: 16
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);
const colors = ["bg-red-100", "bg-puple-100", "bg-lime-100", "bg-pink-100", "bg-blue-100", "bg-cyan-100"];

const DonationCard = ({ item, isRequest, index }) => {
    const bgColors = [
      "bg-red-50",
      "bg-purple-50",
      "bg-lime-50",
      "bg-pink-50",
      "bg-blue-50",
      "bg-cyan-50"
    ];
  
    const statusColors = {
      pending: "#FBBF24",
      accepted: "#3B82F6",
      completed: "#10B981",
    };
  
    const status = item.status?.toLowerCase() || "pending";
    const title = isRequest 
      ? `${item.food_category} (Qty: ${item.quantity_needed})` 
      : item.food_name || "Donation";
    
    const formattedDate = item.created_at 
      ? format(new Date(item.created_at), "dd MMM yyyy, hh:mm a") 
      : "N/A";
  
    const cardBgColor = bgColors[index % bgColors.length];
  
    return (
      <View className={`${cardBgColor} mt-10 mb-4 rounded-xl p-4 shadow-sm`}>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">{title}</Text>
          <View style={{ 
            backgroundColor: statusColors[status],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12
          }}>
            <Text className="text-white capitalize">{status}</Text>
          </View>
        </View>
        <Text className="text-gray-500 mt-2">{formattedDate}</Text>
      </View>
    );
  };

const HistoryScreen = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [liveDonations, setLiveDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!user || !user.token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/recipient/req/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setRequests(data.data || []);
        setLiveDonations(data.liveDonations || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const dataToShow = activeTab === "requests" ? requests : liveDonations;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header />

      {/* Tabs */}
      <View style={{
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderBottomWidth: 2,
        borderBottomColor: "#E5E7EB",
        marginTop: 2,
      }}>
        <TabButton label="Requests" isActive={activeTab === "requests"} onPress={() => setActiveTab("requests")} />
        <TabButton label="Live" isActive={activeTab === "live"} onPress={() => setActiveTab("live")} />
      </View>

      <ScrollView
        style={{ paddingHorizontal: 16, flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
        ) : dataToShow.length > 0 ? (
          dataToShow.map((item, index) => (
            <DonationCard key={item._id || index} index={index} item={item} isRequest={activeTab === "requests"} />
          ))
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
            <Icon name="inbox" size={48} color="#9CA3AF" />
            <Text style={{ color: "#6B7280", marginTop: 8 }}>No {activeTab} items found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
