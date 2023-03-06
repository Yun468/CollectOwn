import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from '../moudle/addQPage.module.css';

function AddQPage() {
  const { uid } = useParams();
  const [formContent, setFormContent] = useState([]);
  const [onEditTitle, setOnEditTitle] = useState(false);
  const [onEditTitleLable, setOnEditTitleLable] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [textField, setTextField] = useState('');
  const [editedField, setEditedField] = useState(false);
  const date = (+new Date()).toString();

  // Form title
  const FormTitle = {
    user: { uid },
    title: '未命名表單',
  };
  const [formTitleContent, setFormTitleContent] = useState([FormTitle]);
  const FormLabel = {
    user: { uid },
    label: '表單說明',
  };
  const [formLabelContent, setFormLabelContent] = useState([FormLabel]);

  const editFormTitle = (value) => {
    FormTitle.title = value;
    setFormTitleContent([FormTitle]);
  };
  const editFormLable = (value) => {
    FormLabel.label = value;
    setFormLabelContent([FormLabel]);
  };

  // 增加題數
  const addQuestion = () => {
    const RandomNumber = Math.floor(Math.random() * 1000);
    const field = {
      name: RandomNumber,
      label: '題目說明',
      question_type: 'short_answer', // "paragraph","multichoice","more_than_one","drop_down"
      list: [],
    };
    setFormContent([...formContent, field]);
  };
  // 編輯題目說明
  const editField = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      formFileds[fieldChosedIndex].label = fieldValue;
      setFormContent(formFileds);
    }
  };
  // 切換題型
  const editFieldType = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      formFileds[fieldChosedIndex].question_type = fieldValue;
      setFormContent(formFileds);
    }
  };
  // 題型單選。建立選項
  const addFieldOption = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      if (fieldValue !== '') {
        formFileds[fieldChosedIndex].list.push(fieldValue);
        setFormContent(formFileds);
        setTextField('');
        document.getElementById(`input${fieldName}`).value = '';
      }
    }
  };
  // 刪除radio選項(單選題)
  const delRadio = (fieldName, item) => {
    const formFileds = [...formContent];
    const field = formFileds.filter((index) => index.name === fieldName)[0]; // 目標field
    const arr = field.list.filter((index) => index !== item); // 目標field的list中找出不要的item，返回一個新的list
    for (let i = 0; i < formFileds.length; i += 1) {
      if (formFileds[i].name === fieldName) {
        formFileds[i].list = arr;
      }
    }
    setFormContent(formFileds);
  };
  // 刪除問題
  const delQuestion = (fieldName) => {
    const formFileds = [...formContent];
    const newformFileds = formFileds.filter((index) => index.name !== fieldName);
    setFormContent(newformFileds);
  };
  // 儲存表單到firebase
  const creatUserFrom = () => {
    const preview = document.getElementById('addQ_preview');
    const { title } = formTitleContent[0];
    setDoc(doc(db, uid, date), {
      name: title,
      html: preview.outerHTML,
    });
  };

  return (
    <div className={styles.back}>
      <div className={styles.background}>
        <div className={styles.title}>
          {formTitleContent.map((formTitle) => (
            <div>
              {onEditTitle ? (
                <input
                  key={formTitle.user}
                  className={`${styles.title_input} ${styles.title_input_edit}`}
                  type="text"
                  value={formTitle.title}
                  onChange={(e) => editFormTitle(e.target.value)}
                  onBlur={() => {
                    setOnEditTitle(false);
                  }}
                />
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className={styles.title_input}
                  onClick={() => {
                    setOnEditTitle(true);
                  }}
                  onKeyDown={() => {
                    setOnEditTitle(true);
                  }}
                >
                  {formTitle.title}
                </div>
              )}
            </div>
          ))}
          {formLabelContent.map((formLabel) => (
            <div>
              {onEditTitleLable ? (
                <textarea
                  className={`${styles.intr_input} ${styles.intr_input_edit}`}
                  rows={4}
                  value={formLabel.label}
                  onChange={(e) => editFormLable(e.target.value)}
                  onBlur={() => {
                    setOnEditTitleLable(false);
                  }}
                />
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className={styles.intr_input}
                  onClick={() => {
                    setOnEditTitleLable(true);
                  }}
                  onKeyDown={() => {
                    setOnEditTitleLable(true);
                  }}
                >
                  {formLabel.label}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className={styles.addpreset_btn}
          onClick={() => addQuestion()}
          onKeyDown={() => addQuestion()}
          role="button"
          tabIndex={0}
          aria-label="增加問題"
        />
        <div className={styles.preset_container}>
          {formContent.map((field) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={field.name}
              id={field.name}
              className={styles.main}
              onClick={() => {
                setOnEdit(true);
                setEditedField(field.name);
              }}
              onKeyDown={() => {
                setOnEdit(true);
                setEditedField(field.name);
              }}
            >
              <div className={styles.preset}>
                <div className={styles.preset_title}>
                  {onEdit && editedField === field.name ? (
                    <textarea
                      className={styles.main_edit}
                      rows={4}
                      cols={50}
                      value={field.label}
                      onChange={(e) => editField(field.name, e.target.value)}
                      onBlur={() => {
                        setOnEdit(false);
                        setEditedField('');
                      }}
                    />
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      className={styles.preset_title_label}
                      onClick={() => {
                        setOnEdit(true);
                        setEditedField(field.name);
                      }}
                      onKeyDown={() => {
                        setOnEdit(true);
                        setEditedField(field.name);
                      }}
                    >
                      {field.label}
                    </div>
                  )}
                </div>
                <div>
                  <select
                    className={styles.preset_select}
                    onChange={(e) => editFieldType(field.name, e.target.value)}
                  >
                    <option value="short_answer">簡答題</option>
                    <option value="paragraph">問答題</option>
                    <option value="drop_down">下拉式選單</option>
                    <option value="multichoice">單選題</option>
                    <option value="more_than_one">多選題</option>
                  </select>
                </div>
              </div>
              <div>
                {field.question_type === 'short_answer' && (
                  <input type="text" className={styles.preset_ans_text} placeholder={field.label} />
                )}
                {field.question_type === 'paragraph' && (
                  <textarea rows={4} className={styles.preset_ans_text} placeholder={field.label} />
                )}
                {field.question_type === 'drop_down' && (
                  <div>
                    <select className={styles.preset_ans_select}>
                      {field.list.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <div>
                      <input
                        id={`input${field.name}`}
                        className={styles.preset_ans_select_inp}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入內容，建立你的選項"
                      />
                      <button
                        className={styles.preset_ans_select_btn}
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </div>
                )}
                {field.question_type === 'multichoice' && (
                  <>
                    {field.list.map((item) => (
                      <div className={styles.radio}>
                        <input className={styles.radio_cir} type="radio" name={`input${field.name}`} value={item} />
                        <div className={styles.radio_opt}>{item}</div>
                        <div
                          className={styles.radio_del_btn}
                          onClick={() => delRadio(field.name, item)}
                          aria-label="刪除"
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => delRadio(field.name, item)}
                        />
                      </div>
                    ))}
                    <div>
                      <input className={styles.radio_pre} type="radio" disabled="true" />
                      <input
                        id={`input${field.name}`}
                        className={styles.preset_ans_select_inp}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入內容來建立選項(單選題)"
                      />
                      <button
                        className={styles.preset_ans_select_btn}
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </>
                )}
                {field.question_type === 'more_than_one' && (
                  <>
                    {field.list.map((item) => (
                      <div className={styles.checkbox}>
                        <input className={styles.radio_cir} type="checkbox" name={`input${field.name}`} value={item} />
                        <div className={styles.radio_opt}>{item}</div>
                        <div
                          className={styles.radio_del_btn}
                          onClick={() => delRadio(field.name, item)}
                          aria-label="刪除"
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => delRadio(field.name, item)}
                        />
                      </div>
                    ))}
                    <div>
                      <input className={styles.radio_pre} type="checkbox" disabled="true" />
                      <input
                        id={`input${field.name}`}
                        className={styles.preset_ans_select_inp}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入內容來建立選項(多選題)"
                      />
                      <button
                        className={styles.preset_ans_select_btn}
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                className={styles.del_btn}
                onClick={() => delQuestion(field.name)}
                onKeyDown={() => delQuestion(field.name)}
                aria-label="刪除題目"
              />
            </div>
          ))}
        </div>
        <Link to={date}>
          <button type="button" className={styles.creatQ_btn} onClick={() => creatUserFrom()}>
            建立表單
          </button>
        </Link>
        <div className={styles.description}>
          編輯方式：
          <li>表單標題：雙擊文字標題（預設為未命名表單）</li>
          <li>增加題目：點擊 「＋」 符號</li>
          <li>變更題型：使用題目中右上角的選單更動</li>
          <li>刪除題目：使用題目中左下角的刪除圖示</li>
        </div>
      </div>
      {/* -------------------------------- 以下是表單預覽 -----------------------------*/}
      <div className={`${styles.background} ${styles.preview}`} id="addQ_preview">
        <div className={styles.title}>
          {formTitleContent.map((formTitle) => (
            <div className={styles.title_input}>{formTitle.title}</div>
          ))}
          {formLabelContent.map((formLabel) => (
            <div className={styles.intr_input}>{formLabel.label}</div>
          ))}
        </div>
        <div className={styles.preset_container}>
          {formContent.map((field) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={field.name}
              id={field.name}
              className={`${styles.main} addQ_main`}
              onClick={() => {
                setOnEdit(true);
                setEditedField(field.name);
              }}
              onKeyDown={() => {
                setOnEdit(true);
                setEditedField(field.name);
              }}
            >
              <div className={styles.preset}>
                <div className={styles.preset_title}>
                  <div
                    className={`${styles.preset_title_label} addQ_preset_title_label`}
                  >
                    {field.label}
                  </div>
                </div>
              </div>
              <div id={`${field.name}${field.question_type}`}>
                {field.question_type === 'short_answer' && (
                  <input type="text" className={styles.preset_ans_text} placeholder={field.label} />
                )}
                {field.question_type === 'paragraph' && (
                  <textarea rows={4} className={styles.preset_ans_text} placeholder={field.label} />
                )}
                {field.question_type === 'drop_down' && (
                  <select className={styles.preset_ans_select}>
                    {field.list.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                )}
                {field.question_type === 'multichoice' && (
                  <>
                    {field.list.map((item) => (
                      <div className={styles.radio}>
                        <input className={styles.radio_cir} type="radio" name={`input${field.name}`} value={item} />
                        <div className={styles.radio_opt}>{item}</div>
                      </div>
                    ))}
                  </>
                )}
                {field.question_type === 'more_than_one' && (
                  <>
                    {field.list.map((item) => (
                      <div className={styles.checkbox}>
                        <input className={styles.radio_cir} type="checkbox" name={`input${field.name}`} value={item} />
                        <div className={styles.radio_opt}>{item}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default AddQPage;
