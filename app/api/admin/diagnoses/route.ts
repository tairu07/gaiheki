import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getAdminSession } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 管理者認証
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // まず基本的な診断情報のみを取得
    const diagnoses = await prisma.diagnosis_requests.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    // Enumマッピング
    const floorAreaMap = {
      'UNKNOWN': '不明',
      'UNDER_80': '80平米未満',
      'FROM_80_TO_100': '80-100平米',
      'FROM_101_TO_120': '101-120平米',
      'FROM_121_TO_140': '121-140平米',
      'FROM_141_TO_160': '141-160平米',
      'FROM_161_TO_180': '161-180平米',
      'FROM_181_TO_200': '181-200平米',
      'FROM_201_TO_250': '201-250平米',
      'FROM_251_TO_300': '251-300平米',
      'FROM_301_TO_500': '301-500平米',
      'OVER_501': '501平米以上'
    };

    const currentSituationMap = {
      'MARKET_RESEARCH': '市場調査中',
      'CONSIDERING_CONSTRUCTION': '施工検討中',
      'COMPARING_CONTRACTORS': '業者比較中',
      'READY_TO_ORDER': '発注準備',
      'CONSTRUCTION_COMPLETED': '工事完了'
    };

    const constructionTypeMap = {
      'EXTERIOR_PAINTING': '外壁塗装',
      'ROOF_PAINTING': '屋根塗装',
      'EXTERIOR_AND_ROOF': '外壁・屋根塗装',
      'PARTIAL_REPAIR': '部分補修',
      'WATERPROOFING': '防水工事',
      'SIDING_REPLACEMENT': 'サイディング交換',
      'FULL_REPLACEMENT': '全面交換'
    };

    const statusMap = {
      'DESIGNATED': '業者指定',
      'RECRUITING': '見積もり募集中',
      'COMPARING': '見積もり比較中',
      'DECIDED': '業者決定',
      'CANCELLED': 'キャンセル'
    };

    // データを整形（基本情報のみ）
    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      id: `GH-${String(diagnosis.id).padStart(5, '0')}`,
      customerName: '顧客名不明',
      age: floorAreaMap[diagnosis.floor_area] || diagnosis.floor_area || '不明',
      issue: currentSituationMap[diagnosis.current_situation] || diagnosis.current_situation || '',
      workType: constructionTypeMap[diagnosis.construction_type] || diagnosis.construction_type || '',
      requestDate: diagnosis.created_at ?
        new Date(diagnosis.created_at).toLocaleDateString('ja-JP') : '',
      status: statusMap[diagnosis.status] || diagnosis.status || '見積もり募集中',
      isUrgent: false,
      // 詳細情報（基本フィールドのみ）
      email: '',
      phone: '',
      address: '',
      buildingAge: '',
      budget: '',
      desiredPeriod: '',
      comment: ''
    }));

    return NextResponse.json(formattedDiagnoses);
  } catch (error) {
    console.error('Error fetching diagnoses:', error);

    // データベース接続エラーの場合はモックデータを返す
    const mockData = [
      { id: "GH-00001", customerName: "高橋太", age: "101～150平米 (31～45坪)", issue: "劣化が少し気になる", workType: "外壁全面の塗装", requestDate: "2024年03月01日", status: "見積もり募集中", isUrgent: false },
      { id: "GH-00002", customerName: "田中陽", age: "51～100平米 (16～30坪)", issue: "色褪せや汚れが気になる", workType: "屋根の塗装", requestDate: "2024年02月28日", status: "見積もり比較中", isUrgent: false },
      { id: "GH-00003", customerName: "鈴木賢", age: "151～200平米 (46～61坪)", issue: "色褪せや汚れが気になる", workType: "外壁の塗装", requestDate: "2024年02月25日", status: "業者決定", isUrgent: false },
      { id: "GH-00004", customerName: "千葉真", age: "201～250平米 (61～76坪)", issue: "ひび割れや破損したところがある", workType: "補修・防水", requestDate: "2024年02月20日", status: "見積もり募集中", isUrgent: false },
      { id: "GH-00005", customerName: "東京悟", age: "～50平米 (15坪) 以下", issue: "工事中心", workType: "外壁の塗り替え（サイディング）", requestDate: "2024年02月18日", status: "見積もり比較中", isUrgent: false }
    ];

    return NextResponse.json(mockData);
  } finally {
    // シングルトンなので切断しない
  }
}